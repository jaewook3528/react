import React, { useState } from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import Responsive from '../common/Responsive';
import { useDispatch} from 'react-redux';
import { deleteComment,writeCommentReply} from '../../lib/api/posts';
import { listComments } from '../../modules/post';

const CommentListBlock = styled(Responsive)`
  margin-top: 3rem;
  padding-left: 0rem;
`;

const CommentItemBlock = styled.div`
  padding-top: 1rem;
  padding-bottom: 1rem;
  padding-left: 0rem;
  border:1px solid #333;
  &:first-child {
    padding-top: 0;
  }

  & + & {
    border-top: 1px solid ${palette.gray[2]};
  }

  h4 {
    margin: 0;
    margin-bottom: 0.5rem;
    color: ${palette.gray[8]};
  }

  p {
    margin-top: 0.5rem;
  }
  textarea{
    margin-top:5px;
    width:90%;
  }
  .comment{
   
    padding:15px;
  }
`;

const CommentItem = ({ comment, onRemove ,loginuser}) => {
  
  const { _id, user, text, createdAt,replies  } = comment;
  const [replyText, setReplyText] = useState('');
  const [replyList,setReplyList] = useState(replies);

  const dispatch = useDispatch();

  const handleRemove = async (idx) => {
   
    if(comment.user._id === loginuser._id){
      //console.log(idx);
      //return;
      try {
        await deleteComment({ postId: comment.post, commentId: idx });
        onRemove(_id);
        dispatch(listComments(comment.post)); // 댓글 목록 불러오기
        setReplyList(replyList.filter((reply) => reply._id !== idx));
      } catch (e) {
        console.log(e);
      }

    }else{
      alert('본인 댓글만 삭제하실 수 있습니다.');
      return false;
    }   
  };


  const handleReplySubmit = async () => {
    if (!replyText) {
      alert('대댓글을 입력해주세요.');
      return;
    }
    //console.log(_id);
    try {
      const response = await writeCommentReply({
        postId: comment.post,
        text: replyText,
        parentCommentId: _id, // 부모 댓글의 ID를 전달
      });
      setReplyList([...replyList, response.data]);
      setReplyText('');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <CommentItemBlock> 
      <p className="comment">{text}</p>
      <p className="comment">작성자 : {user.username} 작성날짜 :{new Date(createdAt).toLocaleDateString()}  <button onClick={() => handleRemove(_id)}>삭제</button></p>
     

      {replyList.map((reply) => (
        <CommentItemBlock key={reply._id} style={{ marginLeft: '3rem',marginRight: '2rem',border:'1px solid #eeeeee'}}>
          <p>{reply.text}</p>
          <p>
            작성자: {reply.user.username} 작성날짜:{' '}
            {new Date(reply.createdAt).toLocaleDateString()}
            {reply.user._id === loginuser._id && (
              <button onClick={() => handleRemove(reply._id)}>삭제</button>
            )}
          </p>
          
        </CommentItemBlock>
      ))}
      {/* 대댓글 작성 폼 */}
      <div style={{ marginLeft: '2rem' }}>
        <textarea
          placeholder="대댓글을 입력하세요"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
        <button onClick={handleReplySubmit}>등록</button>
      
      </div>
    </CommentItemBlock>
  );
};

const CommentList = ({ comments,loginuser }) => {
  //console.log('aaa');
  const [commentList, setCommentList] = useState(comments);

  const handleRemove = (id) => {
    setCommentList(commentList.filter((comment) => comment._id !== id));
  };
  return (
    <CommentListBlock>
      <h4>댓글 리스트</h4>
      {comments.map(comment => (
        <CommentItem key={comment._id} comment={comment} loginuser={loginuser} onRemove={handleRemove}/>
      ))}
    </CommentListBlock>
  );
};

export default CommentList;