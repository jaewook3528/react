import qs from 'qs';
import client from './client';

export const writePost = ({ title, body, tags }) =>
  client.post('/api/posts', { title, body, tags });

export const readPost = id => client.get(`/api/posts/${id}`);

export const listPosts = ({ page, username, tag }) => {
  const queryString = qs.stringify({
    page,
    username,
    tag,
  });
  return client.get(`/api/posts?${queryString}`);
};

export const updatePost = ({ id, title, body, tags }) =>
  
  client.patch(`/api/posts/${id}`, {
    title,
    body,
    tags,
});

export const removePost = id => client.delete(`/api/posts/${id}`);

export const writeComment = ({ postId, text, user }) =>
  client.post(`/api/posts/${postId}/comments`, { text, user });

export const writeCommentReply = ({ postId, text, parentCommentId }) =>
  client.post(`/api/posts/${postId}/replycomments`, { text, parentCommentId });

export const listComments = postId => client.get(`/api/posts/${postId}/comments`);
export const listCommentReplies = (postId, commentId) =>
  client.get(`/api/posts/${postId}/comments/${commentId}/replies`);
  
export const deleteComment = ({ postId, commentId }) =>
  client.delete(`/api/posts/${postId}/comments/${commentId}`);


/*
export const removeComment = async ({postId,commentId}) => client.delete(`/api/posts/${postId}/comments/${commentId}`);
*/






