import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { format, isSameMinute } from 'date-fns';

import { DATE_FORMAT } from 'common/constants';
import getSrsRankName from 'common/utils/getSrsRankName';
import getDateInWords from 'common/utils/getDateInWords';
import calculatePercentage from 'common/utils/calculatePercentage';

import { selectReviewById } from 'features/reviews/selectors';

import StreakStatus from './StreakStatus';
import Status from './Status';

function getReviewStatusText(isHidden, isReviewReady, nextReviewDate) {
  if (isHidden) {
    return 'Entry Locked';
  }
  if (isReviewReady) {
    return 'Now';
  }
  if (nextReviewDate) {
    return getDateInWords(nextReviewDate);
  }
  return 'N/A';
}

VocabStats.propTypes = {
  correct: PropTypes.number.isRequired,
  incorrect: PropTypes.number.isRequired,
  streak: PropTypes.number.isRequired,
  wanikaniStreak: PropTypes.number.isRequired,
  hidden: PropTypes.bool.isRequired,
  needsReview: PropTypes.bool.isRequired,
  critical: PropTypes.bool.isRequired,
  nextReviewDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.oneOf([false]),
  ]).isRequired,
  lastStudied: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.oneOf([false]),
  ]).isRequired,
  unlockDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.oneOf([false]),
  ]).isRequired,
};

export function VocabStats({
  streak,
  wanikaniStreak,
  correct,
  incorrect,
  critical,
  hidden,
  needsReview,
  nextReviewDate,
  lastStudied,
  unlockDate,
}) {
  const kaniwaniBurned = getSrsRankName(streak) === 'BURNED';
  // TODO: get Tadgh to investigate why these are the same minute,
  // but different seconds when it seems lastStudied should be null
  const fishyLastStudiedDate = isSameMinute(lastStudied, unlockDate);
  let lastStudiedStatus = fishyLastStudiedDate ? 'N/A' : getDateInWords(lastStudied);
  lastStudiedStatus = kaniwaniBurned ? format(lastStudied, DATE_FORMAT) : lastStudiedStatus;
  return (
    <div>
      <StreakStatus category="KW" streak={streak} />
      <StreakStatus category="WK" streak={wanikaniStreak} />
      <Status text="Unlocked" status={format(unlockDate, DATE_FORMAT)} />
      <Status text={kaniwaniBurned ? 'Burned' : 'Last reviewed'} status={lastStudiedStatus} />
      {nextReviewDate != null && (
        <Status
          text="Next review"
          status={getReviewStatusText(hidden, needsReview, nextReviewDate)}
        />
      )}
      <Status text="Correct" status={correct} />
      <Status text="Incorrect" status={incorrect} />
      <Status
        text="Accuracy"
        status={`${calculatePercentage(correct, correct + incorrect)}%` || 'N/A'}
      />
      {!kaniwaniBurned && <Status text="Critical" status={critical ? 'Yes' : 'Nope!'} />}
    </div>
  );
}

// TODO: more refined selectors?
const mapStateToProps = (state, props) => ({
  ...selectReviewById(state, props),
});

export default connect(mapStateToProps)(VocabStats);