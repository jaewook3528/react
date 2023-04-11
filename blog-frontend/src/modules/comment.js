import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import * as commentsAPI from '../lib/api/comments';
import { takeLatest } from 'redux-saga/effects';
import createRequestSaga, {
  createRequestActionTypes,
} from '../lib/createRequestSaga';

const INITIALIZE = 'comment/INITIALIZE';
const CHANGE_FIELD = 'comment/CHANGE_FIELD';
const [
  WRITE_COMMENT,
  WRITE_COMMENT_SUCCESS,
  WRITE_COMMENT_FAILURE,
] = createRequestActionTypes('comment/WRITE_COMMENT');
const SET_ERROR = 'comment/SET_ERROR';
const SET_COMMENT = 'comment/SET_COMMENT';

export const initialize = createAction(INITIALIZE);
export const changeField = createAction(CHANGE_FIELD, ({ key, value }) => ({
  key,
  value,
}));
export const writeComment = createAction(WRITE_COMMENT, ({ postId, contents }) => ({
  postId,
  contents,
}));
export const setError = createAction(SET_ERROR, error => error);
export const setComment = createAction(SET_COMMENT, comment => comment);

const writeCommentSaga = createRequestSaga(WRITE_COMMENT, commentsAPI.writeComment);

export function* commentSaga() {
  yield takeLatest(WRITE_COMMENT, writeCommentSaga);
}

const initialState = {
  comment: null,
  contents: '',
  error: null,
};

const comment = handleActions(
  {
    [INITIALIZE]: () => initialState,
    [CHANGE_FIELD]: (state, { payload: { key, value } }) =>
      produce(state, draft => {
        draft[key] = value;
      }),
    [WRITE_COMMENT_SUCCESS]: (state, { payload: comment }) => ({
      ...state,
      comment,
      error: null,
    }),
    [WRITE_COMMENT_FAILURE]: (state, { payload: error }) => ({
      ...state,
      error,
    }),
    [SET_ERROR]: (state, { payload: error }) => ({
      ...state,
      error,
    }),
    [SET_COMMENT]: (state, { payload: comment }) => ({
      ...state,
      comment,
    }),
  },
  initialState,
);

export default comment;