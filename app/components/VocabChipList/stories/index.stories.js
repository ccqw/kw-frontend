import React from 'react';
import { storiesOf } from '@kadira/storybook';
import random from 'lodash/random';

import { vocabs } from 'utils/tests/testTables';
import VocabChipList from '../index';

const generateItems = () => vocabs.map((vocab) => ({
  ...vocab,
  history: {
    correct: random(10),
    incorrect: random(10),
  },
  session: {
    correct: random(10),
    incorrect: random(10),
    streak: random(11),
  },
}));

storiesOf('components.VocabChipList', module)
  .add('VocabChipList with required props', () => (
    <VocabChipList
      items={generateItems()}
    />
  ))
  .add('VocabChipList with color prop', () => (
    <VocabChipList
      items={generateItems()}
      color="green"
    />
  ));
