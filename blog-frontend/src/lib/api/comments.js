import client from './client';

export const writeComment = ({ postId, text }) =>
  //console.log(postId);
  client.post(`/api/posts/${postId}/comments`, { text });

export const readComments = (postId) =>
  client.get(`/api/posts/${postId}/comments`);

export const updateComment = ({ commentId, text }) =>
  client.patch(`/api/comments/${commentId}`, { text });

export const removeComment = (commentId) =>
  client.delete(`/api/comments/${commentId}`);