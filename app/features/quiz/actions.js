import { createActions } from 'redux-actions';
import { SYNC, ASYNC } from 'common/actions';

// FIXME: these are nice to see all together, but everything related to them is nested
// should probably break it apart into separate actions files
// at least into export const { quizSession } & export const { quizSummary } (instead of { quiz })
// OR rather we should just combine all the other quiz stuff into a single root logic / reducer file like this
export const { quiz } = createActions({
  QUIZ: {
    SUMMARY: {
      RESET: SYNC,
      ADD_CORRECT: SYNC,
      ADD_INCORRECT: SYNC,
    },
    SESSION: {
      RESET: SYNC,
      SET_CATEGORY: SYNC,
      SET_SYNONYM_MODAL: SYNC,
      ADD_CORRECT: SYNC,
      ADD_INCORRECT: SYNC,
      ADD_COMPLETE: SYNC,
      WRAP_UP: {
        TOGGLE: SYNC,
        DECREMENT: SYNC,
      },
      QUEUE: {
        LOAD: ASYNC,
        CLEAR: SYNC,
        REMOVE: SYNC,
      },
      CURRENT: {
        REPLACE: SYNC,
        ROTATE: SYNC,
        UPDATE: SYNC,
      },
    },
    QUESTION: {
      ADVANCE: SYNC,
    },
    ANSWER: {
      UPDATE: SYNC,
      CHECK: SYNC,
      CORRECT: SYNC,
      INCORRECT: SYNC,
      IGNORE: SYNC,
      SUBMIT: SYNC,
      CONFIRM: SYNC,
      RECORD: ASYNC,
      RESET: SYNC,
    },
    INFO: {
      SHOW: SYNC,
      UPDATE: SYNC,
      CYCLE_DETAIL: SYNC,
      RESET: SYNC,
    },
  },
});

export default quiz;
