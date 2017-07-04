import { createLogic } from 'redux-logic';
import { serializeLevels } from 'shared/serializers';

import {
  lockLevel,
  unlockLevel,
  getLevels,
} from 'shared/api';

import actions from './actions';

export const levelsLoadLogic = createLogic({
  type: actions.load.request,
  cancelType: actions.load.cancel,
  latest: true,
  warnTimeout: 10000,
  processOptions: {
    successType: actions.load.success,
    failType: actions.load.failure,
  },

  process() {
    return getLevels().then((response) => serializeLevels(response));
  },
});

export const levelLockLogic = createLogic({
  type: actions.locklevel.request,
  cancelType: actions.locklevel.cancel,
  warnTimeout: 10000,
  processOptions: {
    successType: actions.locklevel.success,
    failType: actions.locklevel.failure,
  },

  process({ action: { payload: { level } } }) {
    return lockLevel(level).then(() => ({ level }));
  },
});

export const levelUnlockLogic = createLogic({
  type: actions.unlocklevel.request,
  cancelType: actions.unlocklevel.cancel,
  warnTimeout: 10000,
  processOptions: {
    successType: actions.unlocklevel.success,
    failType: actions.unlocklevel.failure,
  },

  process({ action: { payload: { level } } }) {
    return unlockLevel(level).then(() => ({ level }));
  },
});

// All logic to be loaded
export default [
  levelsLoadLogic,
  levelLockLogic,
  levelUnlockLogic,
];