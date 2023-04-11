import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { readPost, unloadPost,listComments } from '../../modules/post';
import PostViewer from '../../components/post/PostViewer';
import PostActionButtons from '../../components/post/PostActionButtons';
import { setOriginalPost } from '../../modules/write';
import { removePost } from '../../lib/api/posts';

const PostViewerContainer = ({ match, history }) => {
  const { postId } = match.params;
  const dispatch = useDispatch();
 
  const { post,comments,  error, loading, user } = useSelector(({ post, loading, user }) => ({
    
    post: post.post,
    comments : post.comments,
    error: post.error,
    loading: loading['post/READ_POST'],
    user: user.user,
  }));
  

  console.log(comments);
  //console.log(post);
  const onRemove = async () => {
    //user && user.id === post && post.id
    try {
      await removePost(postId);
      history.push('/'); // 홈으로 이동
    } catch (e) {
      console.log(e);
    }
  };



  useEffect(() => {
    dispatch(readPost(postId));
    dispatch(listComments(postId)); // 댓글 목록 불러오기
    // 언마운트될 때 리덕스에서 포스트 데이터 없애기
    return () => {
      dispatch(unloadPost());
    };
  }, [dispatch, postId]);

  const onEdit = () => {
    dispatch(setOriginalPost(post));
    history.push('/write');
  };

  return (
    <PostViewer
      post={post}
      loading={loading}
      error={error}
      comments={comments}
      loginuser={user}
      actionButtons={<PostActionButtons onEdit={onEdit} onRemove={onRemove} />}
      ownPost={user && user.id === post && post.id}

    >

    </PostViewer>
  );
};

export default withRouter(PostViewerContainer);