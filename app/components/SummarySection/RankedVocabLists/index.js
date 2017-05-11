import React from 'react';
import PropTypes from 'prop-types';
import cuid from 'cuid';
import { branch, renderNothing } from 'recompose';

import groupByRank from 'utils/groupByRank';
import RankedVocabList from '../RankedVocabList';

const hasNoItems = ({ items }) => !items.length;

const enhance = branch(
  hasNoItems,
  renderNothing,
);

const RankedVocab = enhance(RankedVocabList);

RankedVocabLists.propTypes = {
  items: PropTypes.array.isRequired,
  color: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  expanded: PropTypes.bool.isRequired,
};

function RankedVocabLists({ items, ...props }) {
  return (
    <div>
      {/* TODO: memoize */}
      {Object.entries(groupByRank(items)).map(([rank, entries]) =>
        <RankedVocab key={cuid()} rank={rank} items={entries} {...props} />
      )}
    </div>
  );
}

export default RankedVocabLists;
