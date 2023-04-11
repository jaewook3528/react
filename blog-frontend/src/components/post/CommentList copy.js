import React from 'react';

const CommentList = ({ comments }) => {
  return (
    <ul>
      {comments.map((comment) => (
        <li key={comment.id}>
          <div>{comment.text}</div>
          <div>{comment.author.username}</div>
          <div>{comment.createdAt}</div>
        </li>
      ))}
    </ul>
  );
};

export default CommentList;