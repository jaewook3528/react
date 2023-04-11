import React from 'react';
import styled from 'styled-components';


const CommentInputBlock = styled.div`
  margin-top: 3rem;
  padding-top: 3rem;
  border-top: 1px solid blue;
  h3 {
    margin-bottom: 1rem;
  }
  textarea {
    width: 100%;
    min-height: 10rem;
    font-size: 1rem;
    margin-bottom: 1rem;
    padding: 1rem;
    border-radius: 4px;
    border: 1px solid blue;
    outline: none;
    resize: none;
  }
  button {
    float: right;
    padding: 0.5rem 1rem;
    color: white;
    background: blue;
    border-radius: 4px;
    border: none;
    outline: none;
    cursor: pointer;
    &:hover {
      background: blue;
    }
  }
`;


  const CommentInput = ({ comment, onSubmitComment, onChangeComment }) => {
    const { contents } = comment;
  
    const onSubmit = (e) => {
      e.preventDefault();
      onSubmitComment(e);
    };
  
    const onChange = (e) => {
      onChangeComment(e);
    };
  
    return (
      <CommentInputBlock>
      <form onSubmit={onSubmit}>
        <div>
          <textarea
            name="contents"
            placeholder="Write a comment..."
            value={contents}
            onChange={onChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      </CommentInputBlock>
    );
  };
export default CommentInput;