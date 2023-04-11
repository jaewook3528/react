import React from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import Responsive from '../common/Responsive';
import SubInfo from '../common/SubInfo';
import Tags from '../common/Tags';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import { Helmet } from 'react-helmet-async';

const PostViewerBlock = styled(Responsive)`
  margin-top: 4rem;
`;
const PostHead = styled.div`
  border-bottom: 1px solid ${palette.gray[2]};
  padding-bottom: 3rem;
  margin-bottom: 3rem;
  h1 {
    font-size: 3rem;
    line-height: 1.5;
    margin: 0;
  }
`;

const PostContent = styled.div`
  font-size: 1.3125rem;
  color: ${palette.gray[8]};
  border:1px solid #eeeeee;
  min-height:100px;
`;

const PostViewer = ({ post,comments, error, loading, actionButtons,loginuser, ownPost }) => {
  //console.log(ownPost);
  // 에러 발생 시
  if (error) {
    if (error.response && error.response.status === 404) {
      return <PostViewerBlock>존재하지 않는 포스트입니다.</PostViewerBlock>;
    }
    return <PostViewerBlock>오류 발생!</PostViewerBlock>;
  }

  // 로딩 중이거나 아직 포스트 데이터가 없을 때
  if (loading || !post) {
    return null;
  }
  //console.log(post);
  const { title, body, user, publishedDate, tags  } = post;
  //console.log(post);
 // return false;
  return (
    <PostViewerBlock>
      <Helmet>
        <title>{title} -게시판</title>
      </Helmet>
      <PostHead>
        <h1>{title}</h1>
        <SubInfo
          username={user.username}
          publishedDate={publishedDate}
          hasMarginTop
        />
        <Tags tags={tags} />
      </PostHead>
      <h4>본문</h4>
      <PostContent dangerouslySetInnerHTML={{ __html: body }} />
      {actionButtons}
      {user && comments && <CommentList comments={comments} loginuser={loginuser} />}
      {user && <CommentForm postId={post._id} />}
    </PostViewerBlock>
  );
};

export default PostViewer;