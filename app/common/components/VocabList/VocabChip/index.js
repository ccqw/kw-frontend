import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectReviewById, selectPrimaryVocabId } from 'features/reviews/selectors';
import { selectWord, selectPrimaryReading } from 'features/vocab/selectors';

import getSrsRankName from 'common/utils/getSrsRankName';
import calculatePercentage from 'common/utils/calculatePercentage';
import { purple, grey, white, SRS_COLORS } from 'common/styles/colors';
import { Wrapper, Link, Text } from './styles';

VocabChip.propTypes = {
  id: PropTypes.number.isRequired,
  word: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
  withSrsColors: PropTypes.bool,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
};

VocabChip.defaultProps = {
  withSrsColors: false,
  bgColor: purple[5],
  textColor: white[1],
};

export function VocabChip({ id, word, bgColor, textColor, withSrsColors, tooltip, ...props }) {
  return (
    <Wrapper bgColor={bgColor} textColor={textColor} data-tip={tooltip} {...props}>
      <Link plainLink to={`/vocabulary/entry/${id}`}>
        <Text lang="ja" shadowColor={bgColor}>
          {word}
        </Text>
      </Link>
    </Wrapper>
  );
}

const generateToolTip = (review) => {
  const { correct, incorrect, primaryMeaning, primaryReading } = review;
  const total = correct + incorrect;
  const previouslyAnswered = total > 0;
  const percent = calculatePercentage(correct, total);
  return `
    <ul style="list-style:none;margin:0;padding:0;">
      <li>
        <span>JA </span>
        <span lang="ja">${primaryReading}</span>
      </li>
      <li>
        <span>EN</span>
        <span>${primaryMeaning}</span>
      </li>
      <li>
        <span>RC</span>
        <span>${previouslyAnswered ? `${percent}%` : '<small>N/A</small>'}</span>
      </li>
    </ul>
  `;
};

const mapStateToProps = (state, props) => {
  const review = selectReviewById(state, props);
  const vocabId = selectPrimaryVocabId(state, props);
  const word = selectWord(state, { id: vocabId });
  const primaryReading = selectPrimaryReading(state, { id: vocabId });
  const tooltip = generateToolTip({ ...review, primaryReading });
  const textColor = !props.withSrsColors ? props.textColor : review.hidden ? grey[1] : white[1];
  const bgColor = !props.withSrsColors
    ? props.bgColor
    : review.hidden ? grey[6] : SRS_COLORS[getSrsRankName(review.streak)];

  return () => ({
    word,
    tooltip,
    textColor,
    bgColor,
  });
};

export default connect(mapStateToProps)(VocabChip);
