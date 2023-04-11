import { createAction, handleActions } from 'redux-actions';
import createRequestSaga, {
  createRequestActionTypes,
} from '../lib/createRequestSaga';
import * as postsAPI from '../lib/api/posts';
import { takeLatest } from 'redux-saga/effects';

const [
  READ_POST,
  READ_POST_SUCCESS,
  READ_POST_FAILURE,
] = createRequestActionTypes('post/READ_POST');
const [
  LIST_COMMENTS,
  LIST_COMMENTS_SUCCESS,
  LIST_COMMENTS_FAILURE,
] = createRequestActionTypes('post/LIST_COMMENTS');
const UNLOAD_POST = 'post/UNLOAD_POST';

export const readPost = createAction(READ_POST, id => id);
export const listComments = createAction(LIST_COMMENTS, id => id);
export const unloadPost = createAction(UNLOAD_POST);

const readPostSaga = createRequestSaga(READ_POST, postsAPI.readPost);
const listCommentsSaga = createRequestSaga(LIST_COMMENTS, postsAPI.listComments);

export function* postSaga() {
  yield takeLatest(READ_POST, readPostSaga);
  yield takeLatest(LIST_COMMENTS, listCommentsSaga);
}

const initialState = {
  post: null,
  comments: null, // 댓글 목록 추가
  error: null,
};

const post = handleActions(
  {
    [READ_POST_SUCCESS]: (state, { payload: post }) => ({
      ...state,
      post,
    }),
    [READ_POST_FAILURE]: (state, { payload: error }) => ({
      ...state,
      error,
    }),
    [LIST_COMMENTS_SUCCESS]: (state, { payload: comments }) => ({
      ...state,
      comments,
    }),
    [LIST_COMMENTS_FAILURE]: (state, { payload: error }) => ({
      ...state,
      error,
    }),
    [UNLOAD_POST]: () => initialState,
  },
  initialState,
);

export default post;