import React, { useState } from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { writeComment } from '../../lib/api/posts';

const CommentFormBlock = styled.form`
  h4 {
    margin-bottom: 0.5rem;
  }
  textarea {
    width: 100%;
    padding: 1rem;
    font-size: 1.125rem;
    border: none;
    border-bottom: 1px solid ${palette.gray[4]};
    resize: none;
    &:focus {
      outline: none;
      border-bottom: 1px solid ${palette.gray[6]};
    }
  }
  button {
    margin-top: 1rem;
    float: right;
  }
`;

const CommentForm = ({ match, history }) => {
  const [comment, setComment] = useState('');
  const { user } = useSelector(({ user }) => ({
    user: user.user,
  }));
  const { postId } = match.params;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      history.push('/login');
      return;
    }
    try {
        console.log(comment);

      await writeComment({
        postId,
        text: comment,
      });
      setComment('');
      // TODO: 포스트 다시 불러오기
    } catch (e) {
      console.log(e);
    }
  };

  const onChange = (e) => {
    setComment(e.target.value);
  };

  return (
    <CommentFormBlock onSubmit={onSubmit}>
      <h4>댓글 쓰기</h4>
      <textarea
        value={comment}
        onChange={onChange}
        placeholder="댓글을 작성하세요."
        rows={4}
      />
      <button type="submit">등록</button>
    </CommentFormBlock>
  );
};

export default withRouter(CommentForm);