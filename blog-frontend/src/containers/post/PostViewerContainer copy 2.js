import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { readPost, unloadPost } from '../../modules/post';
import PostViewer from '../../components/post/PostViewer';
import PostActionButtons from '../../components/post/PostActionButtons';
import { setOriginalPost } from '../../modules/write';
import { removePost } from '../../lib/api/posts';
import { removePost } from '../../lib/api/comments';
import CommentList from '../../components/post/CommentList';
import CommentInput from '../../components/post/CommentInput_old';
import { initialize, changeField } from '../../modules/comment';

const PostViewerContainer = ({ match, history }) => {
  const { postId } = match.params;
  const dispatch = useDispatch();
  const { post, error, loading, user, comment } = useSelector(({ post, loading, user, comment }) => ({
    post: post.post,
    error: post.error,
    loading: loading['post/READ_POST'],
    user: user.user,
    comment: comment,
  }));

  const onRemove = async () => {
    try {
      await removePost(postId);
      history.push('/'); // 홈으로 이동
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    dispatch(readPost(postId));
    return () => {
      dispatch(unloadPost());
      dispatch(initialize());
    };
  }, [dispatch, postId]);

  const onEdit = () => {
    dispatch(setOriginalPost(post));
    history.push('/write');
  };

  const onSubmitComment = (e) => {
    e.preventDefault();
    // 새로운 댓글 등록
  };

  const onChangeCommentField = (e) => {
    const { value, name } = e.target;
    dispatch(changeField({ key: name, value }));
  };

  return (
    <PostViewer
      post={post}
      loading={loading}
      error={error}
      actionButtons={<PostActionButtons onEdit={onEdit} onRemove={onRemove} />}
      ownPost={user && user.id === post && post.id}
    >
      <CommentList comments={post.comments} />
      {user && <CommentInput comment={comment} onSubmitComment={onSubmitComment} onChangeCommentField={onChangeCommentField} />}
    </PostViewer>
  );
};

export default withRouter(PostViewerContainer);