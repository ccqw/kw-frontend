import { createLogic } from 'redux-logic';

import { app } from 'common/actions';
import synonym from './actions';

export const addSynonymLogic = createLogic({
  type: synonym.add.request,
  warnTimeout: 10000,
  process({ api, serializers, action }, dispatch, done) {
    // transform to server naming format
    const { review, word: character, reading: kana } = action.payload;
    api.synonym
      .create({ review, character, kana })
      .then((res) => {
        dispatch(synonym.add.success(serializers.serializeAddSynonymResponse(res)));
        done();
      })
      .catch((err) => {
        dispatch(app.captureError(err, action.payload));
        dispatch(synonym.add.failure(err));
        done();
      });
  },
});

export const removeSynonymLogic = createLogic({
  type: synonym.remove.request,
  warnTimeout: 10000,
  process({ api, action: { payload } }, dispatch, done) {
    const { id, reviewId } = payload;
    return api.synonym
      .remove({ id })
      .then(() => {
        dispatch(synonym.remove.success({ id, reviewId }));
        done();
      })
      .catch((err) => {
        dispatch(app.captureError(err, payload));
        dispatch(synonym.remove.failure(err));
      });
  },
});

export default [addSynonymLogic, removeSynonymLogic];
