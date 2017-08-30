import { createLogic } from 'redux-logic';
import { push } from 'react-router-redux';
import localForage from 'localforage';
import { purgeStoredState } from 'redux-persist';
import { startSubmit, stopSubmit } from 'redux-form';
import sample from 'lodash/sample';
import difference from 'lodash/difference';

// TODO: inject some of these in store.js as logic dependencies instead?
import * as api from 'shared/api';
import { setToken, clearToken } from 'utils/auth';

import {
  serializeUserResponse,
  serializeLevelsResponse,
  serializeReviewResponse,
  serializeQueueResponse,
  serializeLevelResponse,
  serializeAnnouncementsResponse,
  serializeAddSynonymResponse,
} from 'shared/serializers';

import { selectLevelsSubmitting } from 'containers/VocabLevelsPage/selectors';
// TODO: find/replace sel.selectorZ and import { selectorX, selectorY }
import * as sel from './selectors';
import app from './actions';

export const userRegisterLogic = createLogic({
  type: app.user.register.request,
  process({ action: { payload } }, dispatch, done) {
    const form = 'multiLogin';
    dispatch(startSubmit(form));
    api.registerUser(payload)
      .then(() => {
        dispatch(app.user.login.request(payload));
        dispatch(stopSubmit(form));
        done();
      })
      .catch(({ body }) => {
        dispatch(stopSubmit(form, { ...body, apiKey: body.api_key, _error: body.non_field_errors }));
        dispatch(app.user.register.failure(body));
        done();
      });
  },
});

export const userLoginLogic = createLogic({
  type: app.user.login.request,
  process({ action: { payload } }, dispatch, done) {
    const form = 'multiLogin';
    dispatch(startSubmit(form));
    api.loginUser(payload)
      .then(({ body: { token } }) => {
        dispatch(app.user.login.success(token));
        dispatch(stopSubmit(form));
        done();
      })
      .catch(({ body }) => {
        dispatch(app.user.login.failure(body));
        dispatch(stopSubmit(form, { ...body, _error: body.non_field_errors }));
        done();
      });
  },
});

export const loginRedirectLogic = createLogic({
  type: [app.user.login.success],
  process({ action }, dispatch, done) {
    setToken(action.payload);
    dispatch(push('/'));
    done();
  },
});

export const userResetPasswordLogic = createLogic({
  type: app.user.resetPassword.request,
  process({ action: { payload } }, dispatch, done) {
    const form = 'multiLogin';
    dispatch(startSubmit(form));
    api.resetPassword(payload)
      .then((res) => {
        dispatch(app.user.resetPassword.success(res));
        dispatch(stopSubmit(form));
        // TODO: notify user
        done();
      })
      .catch(({ body }) => {
        dispatch(stopSubmit(form, { ...body, _error: body.non_field_errors }));
        dispatch(app.user.resetPassword.failure(body));
        done();
      });
  },
});

export const userLogoutLogic = createLogic({
  type: app.user.logout,
  process(_, dispatch, done) {
    clearToken();
    purgeStoredState({ storage: localForage }).then(() => {
      console.log('persisted state purged');
    }).catch(() => {
      console.warn('persisted state failed to purge');
    });
    dispatch(app.clearGlobalState());
    dispatch(push('/welcome'));
    done();
  },
});

export const userLoadLogic = createLogic({
  type: app.user.load.request,
  cancelType: app.user.load.cancel,
  warnTimeout: 10000,
  latest: true,
  processOptions: {
    successType: app.user.load.success,
    failType: app.user.load.failure,
  },

  process() {
    return api.getUserProfile()
      .then(({ body }) => serializeUserResponse(body));
  },
});

export const loadQueuesIfNeededLogic = createLogic({
  type: app.user.load.success,
  latest: true,
  process({ getState }, dispatch, done) {
    const state = getState();
    const { reviewCount, lessonCount, reviewQueue, lessonQueue } = ({
      reviewCount: sel.selectSessionCount(state, { category: 'reviews' }),
      lessonCount: sel.selectSessionCount(state, { category: 'lessons' }),
      reviewQueue: sel.selectQueue(state, { category: 'reviews' }),
      lessonQueue: sel.selectQueue(state, { category: 'lessons' }),
    });

    const needReviewsQueue = reviewCount > 0 && reviewQueue.length <= 0;
    const needLessonsQueue = lessonCount > 0 && lessonQueue.length <= 0;
    if (needReviewsQueue) { dispatch(app.reviews.queue.load.request()); }
    if (needLessonsQueue) { dispatch(app.lessons.queue.load.request()); }
    done();
  },
});

export const forceSrsLogic = createLogic({
  type: app.user.srs.request,
  process(_, dispatch, done) {
    return api.syncKw().then(({ body }) => {
      dispatch(app.user.load.success({ profile: { reviewsCount: body.review_count } }));
      done();
    });
  },
});

export const forceWkSrsLogic = createLogic({
  type: app.user.wksrs.request,
  process(_, dispatch, done) {
    return api.syncWk().then(({ body }) => {
      console.log('forcewkresponse', body);
      // dispatch(app.user.load.success({ profile: { reviewsCount: body.review_count } }));
      done();
    });
  },
});


export const announcementsLoadLogic = createLogic({
  type: app.announcements.load.request,
  cancelType: app.announcements.load.cancel,
  warnTimeout: 10000,
  latest: true,
  processOptions: {
    successType: app.announcements.load.success,
    failType: app.announcements.load.failure,
  },

  process() {
    return api.getAnnouncements()
      .then(({ body }) => serializeAnnouncementsResponse(body));
  },
});


export const reviewsQueueLoadLogic = createLogic({
  type: app.reviews.queue.load.request,
  cancelType: app.reviews.queue.load.cancel,
  warnTimeout: 8000,
  latest: true,

  processOptions: {
    successType: app.reviews.queue.load.success,
    failType: app.reviews.queue.load.failure,
  },

  process({ action: { payload } }) {
    return api.getCurrentReviews(payload)
      .then(({ body }) => serializeQueueResponse(body));
  },
});

export const lessonsQueueLoadLogic = createLogic({
  type: app.lessons.queue.load.request,
  cancelType: app.lessons.queue.load.cancel,
  warnTimeout: 8000,
  latest: true,

  processOptions: {
    successType: app.lessons.queue.load.success,
    failType: app.lessons.queue.load.failure,
  },

  process({ action: { payload } }) {
    return api.getCurrentLessons(payload)
      .then(({ body }) => serializeQueueResponse(body));
  },
});

export const setCurrentOnQueueLoadLogic = createLogic({
  type: [app.reviews.queue.load.success, app.lessons.queue.load.success],
  process({ getState, action: { type } }, dispatch, done) {
    const state = getState();
    const category = type === `${app.reviews.queue.load.success}` ? 'reviews' : 'lessons';
    const currentId = sel.selectCurrentId(state, { category });
    const queue = sel.selectQueue(state, { category });
    if (!currentId && queue.length) {
      dispatch(app[category].current.set());
      done();
    } else {
      console.log('Loaded more queue but already have currentId: ', { currentId, category, queue });
    }
  },
});

export const setCurrentLogic = createLogic({
  type: [app.reviews.current.set, app.lessons.current.set],
  validate({ getState, action }, allow, reject) {
    const state = getState();
    const category = action.type === `${app.reviews.current.set}` ? 'reviews' : 'lessons';
    const current = sel.selectCurrent(state, { category });
    const queue = sel.selectQueue(state, { category });
    const correct = sel.selectCorrectIds(state, { category });
    const newId = sample(difference(queue, [current.id]));
    if (newId || queue.length) {
      const newCurrent = sel.selectReviewEntities(state)[newId];
      allow({ ...action, payload: newCurrent });
    }
    if (!newId && current.id && !correct.includes(current.id)) {
      console.log('Current was the only remaining item', { queue, current, newId });
      allow({ ...action, payload: current });
    }
    if (!newId) {
      console.log('End of queue?');
      allow({ ...action, payload: { id: undefined } });
    }
    reject();
  },
});

export const returnCurrentLogic = createLogic({
  type: [app.reviews.current.return, app.lessons.current.return],
  validate({ getState, action }, allow, reject) {
    const state = getState();
    const category = action.type === `${app.reviews.current.return}` ? 'reviews' : 'lessons';
    const currentId = sel.selectCurrentId(state, { category });
    const queue = sel.selectQueue(state, { category });
    const newId = sample(difference(queue, [currentId]));
    if (newId) {
      const newCurrent = sel.selectReviewEntities(state)[newId];
      allow({ ...action, payload: { newCurrent, currentId } });
    } else {
      console.log('Rejected returning current - no other queue items', { queue, currentId, newId });
      reject();
    }
  },
});

export const levelsLoadLogic = createLogic({
  type: app.levels.load.request,
  cancelType: app.levels.load.cancel,
  throttle: 60000,
  latest: true,
  warnTimeout: 10000,
  processOptions: {
    successType: app.levels.load.success,
    failType: app.levels.load.failure,
  },

  process() {
    return api.getLevels()
      .then(({ body }) => serializeLevelsResponse(body));
  },
});

export const levelLockLogic = createLogic({
  type: app.level.lock.request,
  warnTimeout: 10000,
  processOptions: {
    failType: app.level.lock.failure,
  },

  process({ action: { payload: { id } } }, dispatch, done) {
    api.lockLevel({ id })
      .then(() => {
        dispatch(app.reviews.queue.clear());
        dispatch(app.lessons.queue.clear());
        dispatch(app.level.lock.success({ id }));
        dispatch(app.user.load.request());
        done();
      });
  },
});

export const levelUnlockLogic = createLogic({
  type: app.level.unlock.request,
  warnTimeout: 10000,
  validate({ getState, action }, allow, reject) {
    // TODO: could set up a queue instead.
    // https://github.com/jeffbski/redux-logic/tree/master/examples/notification
    const alreadySubmitting = selectLevelsSubmitting(getState()).length >= 1;
    if (alreadySubmitting) {
      alert('Please unlock levels one at a time. Turtles get tired too.');
      reject(/* TODO: app.notifications.alert */);
    } else {
      allow(action);
    }
  },

  processOptions: {
    failType: app.level.unlock.failure,
  },

  process({ action: { payload: { id } } }, dispatch, done) {
    api.unlockLevel({ id })
      .then(() => {
        dispatch(app.level.load.request({ id }));
        dispatch(app.level.unlock.success({ id }));
        dispatch(app.user.load.request());
        done();
      });
  },
});

export const reviewLoadLogic = createLogic({
  type: app.review.load.request,
  cancelType: app.review.load.cancel,
  warnTimeout: 10000,
  latest: true,
  processOptions: {
    successType: app.review.load.success,
    failType: app.review.load.failure,
  },

  process({ action: { payload: { id } } }) {
    return api.getReviewEntry({ id })
      .then(({ body }) => serializeReviewResponse(body));
  },
});

export const reviewLockLogic = createLogic({
  type: app.review.lock.request,
  cancelType: app.review.lock.cancel,
  warnTimeout: 10000,
  latest: true,
  processOptions: {
    successType: app.review.lock.success,
    failType: app.review.lock.failure,
  },

  process({ action: { payload: { id } } }) {
    return api.lockReview({ id })
      .then(() => ({ id, isHidden: true }));
  },
});

export const reviewUnlockLogic = createLogic({
  type: app.review.unlock.request,
  cancelType: app.review.unlock.cancel,
  warnTimeout: 10000,
  latest: true,
  processOptions: {
    successType: app.review.unlock.success,
    failType: app.review.unlock.failure,
  },

  process({ action: { payload: { id } } }) {
    return api.unlockReview({ id })
      .then(() => ({ id, isHidden: false }));
  },
});

export const reviewNotesLogic = createLogic({
  type: app.review.notes.request,
  warnTimeout: 10000,
  latest: true,
  processOptions: {
    failType: app.review.notes.failure,
  },

  process({ action: { payload: { id, notes } } }) {
    return api.saveReviewNotes({ id, notes })
      .then(() => app.review.update({ id, notes }));
  },
});

export const addSynonymLogic = createLogic({
  type: app.review.synonym.add.request,
  warnTimeout: 10000,
  latest: true,
  processOptions: {
    successType: app.review.synonym.add.success,
    failType: app.review.synonym.add.failure,
  },

  process({ action: { payload: { reviewId, character, kana } } }) {
    return api.addSynonym({ reviewId, character, kana })
      .then(({ body }) => serializeAddSynonymResponse(body));
  },
});

export const removeSynonymLogic = createLogic({
  type: app.review.synonym.remove.request,
  cancelType: app.review.synonym.remove.cancel,
  warnTimeout: 10000,
  latest: true,
  processOptions: {
    successType: app.review.synonym.remove.success,
    failType: app.review.synonym.remove.failure,
  },

  process({ action: { payload: { id, reviewId } } }) {
    return api.removeSynonym({ id })
      .then(() => ({ id, reviewId }));
  },
});

export const levelLoadLogic = createLogic({
  type: app.level.load.request,
  cancelType: app.level.load.cancel,
  warnTimeout: 10000,
  latest: true,
  processOptions: {
    successType: app.level.load.success,
    failType: app.level.load.failure,
  },

  process({ action: { payload: { id } } }) {
    return api.getReviews({ id })
      .then(({ body: { results } }) => serializeLevelResponse({ id, results }));
  },
});

export const contactLogic = createLogic({
  type: app.contact.request,
  warnTimeout: 10000,

  process({ action: { payload } }, dispatch, done) {
    const form = 'contact';
    dispatch(startSubmit(form));
    api.sendContactMessage(payload)
      .then(() => {
        dispatch(app.contact.success());
        dispatch(stopSubmit(form));
        done();
      })
      .catch(({ body }) => {
        dispatch(stopSubmit(form, { ...body }));
        // TODO: failure notification
        dispatch(app.contact.failure(body));
        done();
      });
  },
});

// All logic to be loaded
export default [
  userLoginLogic,
  userRegisterLogic,
  loginRedirectLogic,
  userResetPasswordLogic,
  userLogoutLogic,
  userLoadLogic,
  forceSrsLogic,
  forceWkSrsLogic,
  announcementsLoadLogic,
  reviewsQueueLoadLogic,
  lessonsQueueLoadLogic,
  loadQueuesIfNeededLogic,
  setCurrentOnQueueLoadLogic,
  setCurrentLogic,
  returnCurrentLogic,
  levelsLoadLogic,
  levelLockLogic,
  levelUnlockLogic,
  reviewLoadLogic,
  addSynonymLogic,
  removeSynonymLogic,
  reviewLockLogic,
  reviewUnlockLogic,
  reviewNotesLogic,
  levelLoadLogic,
  contactLogic,
];
