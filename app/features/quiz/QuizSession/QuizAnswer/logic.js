import { createLogic } from 'redux-logic';
import { isKana } from 'wanakana';

import { SRS_RANGES } from 'common/constants';
import { ANSWER_TYPES } from 'common/components/AddSynonym/AddSynonymForm';

import determineCriticality from 'common/utils/determineCriticality';
import {
  matchAnswer,
  combineAnswers,
  increment,
  decrement,
  isInputValid,
  cleanseInput,
} from './utils';

import { selectQuizSettings } from 'features/user/selectors';
import { selectVocabById } from 'features/vocab/selectors';
import { selectSynonymById } from 'features/synonyms/selectors';
import {
  selectCategory,
  selectIsReviewQuiz,
  selectIsLessonQuiz,
  selectIsFinalQuestion,
  selectWrapUp,
  selectCurrent,
  selectCurrentPreviouslyIncorrect,
} from 'features/quiz/QuizSession/selectors';
import { selectAnswer, selectAnswerIgnored } from './selectors';

import user from 'features/user/actions';
import quiz from 'features/quiz/actions';
import review from 'features/reviews/actions';
import synonym from 'features/synonyms/actions';

// we set this in quiz.advance and hold onto for clearing in quiz.answer.record
let autoAdvance = {};

const stopAutoAdvance = () => {
  if (autoAdvance.timeoutId != null) {
    clearTimeout(autoAdvance.timeoutId);
    autoAdvance.done();
    autoAdvance = {};
  }
};

export const submitAnswerLogic = createLogic({
  type: quiz.answer.submit,
  latest: true,
  process({ getState, action }, dispatch, done) {
    const { isDisabled } = selectAnswer(getState());
    const answerValue = cleanseInput(action.payload);
    const isValid = isInputValid(answerValue);

    dispatch(
      quiz.answer.update({
        value: answerValue,
        type: isKana(answerValue) ? ANSWER_TYPES.READING : ANSWER_TYPES.WORD,
      })
    );

    if (!isValid) {
      dispatch(quiz.answer.update({ isMarked: true, isValid: false }));
    }

    if (isValid && !isDisabled) {
      dispatch(quiz.answer.check());
    }
    if (isValid && isDisabled) {
      dispatch(quiz.answer.confirm());
    }
    done();
  },
});

export const confirmAnswerLogic = createLogic({
  type: quiz.answer.confirm,
  latest: true,
  process({ getState }, dispatch, done) {
    const { value, isValid, isDisabled } = selectAnswer(getState());
    if (value && isValid && isDisabled) {
      dispatch(quiz.answer.record.request());
    } else {
      // eslint-disable-next-line no-console
      console.warn('Tried to confirm answer, but answer state was invalid');
    }
    done();
  },
});

export const checkAnswerLogic = createLogic({
  type: quiz.answer.check,
  latest: true,
  process({ getState }, dispatch, done) {
    const { value } = selectAnswer(getState());
    const settings = selectQuizSettings(getState());
    let { vocab, synonyms } = selectCurrent(getState());
    vocab = vocab.map((id) => selectVocabById(getState(), { id }));
    synonyms = synonyms.map((id) => selectSynonymById(getState(), { id }));
    const matchedAnswer = matchAnswer(value, combineAnswers(vocab, synonyms));
    const updatedAnswer = {
      isFocused: false,
      isMarked: true,
      isValid: true,
      isDisabled: true,
      isCorrect: false,
      isIncorrect: false,
    };

    if (matchedAnswer) {
      dispatch(
        quiz.answer.update({
          ...updatedAnswer,
          value: matchedAnswer,
          isCorrect: true,
        })
      );
      dispatch(quiz.answer.correct());
      dispatch(quiz.info.update({ isDisabled: false, detailLevel: 1 }));

      if (
        settings.autoExpandAnswerOnSuccess &&
        settings.autoAdvanceOnSuccessDelayMilliseconds > 0
      ) {
        dispatch(quiz.info.update({ isOpen: true }));
      }
    }

    if (!matchedAnswer) {
      dispatch(quiz.answer.update({ ...updatedAnswer, isIncorrect: true }));
      dispatch(quiz.answer.incorrect());
      dispatch(quiz.info.update({ isDisabled: false, detailLevel: 0 }));
      if (settings.autoExpandAnswerOnFailure) {
        dispatch(quiz.info.update({ isOpen: true }));
      }
    }

    done();
  },
});

export const correctAnswerLogic = createLogic({
  type: quiz.answer.correct,
  latest: true,
  process({ getState }, dispatch, done) {
    const settings = selectQuizSettings(getState());
    const current = selectCurrent(getState());
    const previouslyIncorrect = selectCurrentPreviouslyIncorrect(getState());

    if (settings.autoAdvanceOnSuccess) {
      dispatch(quiz.question.advance());
    }

    const newCorrect = !previouslyIncorrect ? increment(current.correct) : current.correct;
    const newStreak = !previouslyIncorrect ? increment(current.streak) : current.streak;
    const updatedReview = {
      ...current,
      correct: newCorrect,
      streak: newStreak,
      critical: determineCriticality(newCorrect, current.incorrect),
    };

    dispatch(quiz.session.current.update(updatedReview));
    done();
  },
});

export const incorrectAnswerLogic = createLogic({
  type: quiz.answer.incorrect,
  latest: true,
  process({ getState }, dispatch, done) {
    const current = selectCurrent(getState());
    const isLessonQuiz = selectIsLessonQuiz(getState());
    const previouslyIncorrect = selectCurrentPreviouslyIncorrect(getState());
    let { incorrect: newIncorrect } = current;
    let { streak: newStreak } = current;

    if (!isLessonQuiz && !previouslyIncorrect) {
      const isCloseToBurned = [...SRS_RANGES.THREE, ...SRS_RANGES.FOUR].includes(newStreak);

      newIncorrect = increment(newIncorrect);
      newStreak = isCloseToBurned
        ? decrement(current.streak - 1) // double decrement if close to burned
        : Math.max(decrement(current.streak), 1); // guard against dropping streak to "lesson" status
    }

    const updatedReview = {
      ...current,
      incorrect: newIncorrect,
      streak: newStreak,
      critical: determineCriticality(current.correct, newIncorrect),
    };

    dispatch(quiz.session.current.update(updatedReview));
    done();
  },
});

export const ignoreAnswerLogic = createLogic({
  type: quiz.answer.ignore,
  validate({ getState, action }, allow, reject) {
    const { isMarked, isDisabled, isCorrect, isIncorrect } = selectAnswer(getState());
    stopAutoAdvance();

    if (isMarked && isDisabled && (isCorrect || isIncorrect)) {
      allow(action);
    } else {
      reject();
    }
  },
  process(_, dispatch, done) {
    // update state immediately for "ignored" animation
    dispatch(quiz.question.advance());
    done();
  },
});

export const recordAnswerLogic = createLogic({
  type: quiz.answer.record.request,
  process({ api, history, getState }, dispatch, done) {
    const category = selectCategory(getState());
    const current = selectCurrent(getState());
    const wrapUp = selectWrapUp(getState());
    const isLessonQuiz = selectIsLessonQuiz(getState());
    const isFinalQuestion = selectIsFinalQuestion(getState());
    const { isCorrect } = selectAnswer(getState());
    const previouslyIncorrect = selectCurrentPreviouslyIncorrect(getState());
    stopAutoAdvance();

    // only add to totals if not already present
    if (!previouslyIncorrect) {
      const action = isCorrect ? 'addCorrect' : 'addIncorrect';
      dispatch(quiz.session[action](current.id));
      dispatch(quiz.summary[action](current.id, { category }));
    }

    if (isCorrect) {
      dispatch(quiz.session.addComplete(current.id));
      if (wrapUp.active) {
        dispatch(quiz.session.wrapUp.decrement());
      }
      if (isFinalQuestion) {
        dispatch(quiz.session.queue.clear());
        setTimeout(() => history.push(`/${category}`), 1000);
      }
      dispatch(quiz.session.current.replace());
    } else {
      dispatch(quiz.session.current.rotate());
    }

    dispatch(quiz.answer.reset());
    dispatch(quiz.info.reset());

    if (isLessonQuiz && !isCorrect) {
      dispatch(review.update(current));
      done();
    } else {
      api.quiz
        .record({ id: current.id, isCorrect, previouslyIncorrect })
        .then(() => {
          dispatch(quiz.answer.record.success(current));
          dispatch(review.update(current));
          if (isFinalQuestion && isCorrect) {
            // wait for review times to be updated on server
            // then reload lesson/review counts
            setTimeout(() => {
              dispatch(user.load.request());
              done();
            }, 5000);
          } else {
            dispatch(quiz.session.queue.load.request());
            done();
          }
        })
        .catch((err) => {
          dispatch(quiz.answer.record.failure(err));
          done();
        });
    }
  },
});

export const autoAdvanceLogic = createLogic({
  type: quiz.question.advance,
  warnTimeout: 11000,
  process({ getState }, dispatch, done) {
    const { autoAdvanceOnSuccessDelayMilliseconds } = selectQuizSettings(getState());
    const answerIgnored = selectAnswerIgnored(getState());

    if (answerIgnored) {
      dispatch(quiz.answer.update({ isIgnored: true }));
      const isReviewQuiz = selectIsReviewQuiz(getState());
      const reviewsQuizDelay = 700;
      const lessonsQuizDelay = 200;
      const msDelay = isReviewQuiz ? reviewsQuizDelay : lessonsQuizDelay;
      // allow time for "ignored" animation to occur in _reviews quiz_
      setTimeout(() => {
        dispatch(quiz.answer.reset());
        dispatch(quiz.info.reset());
        dispatch(quiz.session.current.rotate());
        done();
      }, msDelay);
    } else {
      const timeoutId = setTimeout(() => {
        dispatch(quiz.answer.confirm());
        done();
      }, autoAdvanceOnSuccessDelayMilliseconds);

      autoAdvance = {
        timeoutId,
        done,
      };
    }
  },
});

export const synonymAddLogic = createLogic({
  type: synonym.add.success,
  process(_, dispatch, done) {
    dispatch(quiz.session.setSynonymModal(false));
    dispatch(quiz.answer.ignore());
    done();
  },
});

export default [
  submitAnswerLogic,
  confirmAnswerLogic,
  checkAnswerLogic,
  ignoreAnswerLogic,
  incorrectAnswerLogic,
  correctAnswerLogic,
  recordAnswerLogic,
  autoAdvanceLogic,
  synonymAddLogic,
];
