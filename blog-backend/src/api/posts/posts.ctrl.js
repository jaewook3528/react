import Post from '../../models/post.js';
import Comment from '../../models/comment.js';
import mongoose from 'mongoose';
import Joi from 'joi';
import sanitizeHtml from 'sanitize-html';
const { ObjectId } = mongoose.Types;

const sanitizeOption = {
  allowedTags: [
    'h1',
    'h2',
    'b',
    'i',
    'u',
    's',
    'p',
    'ul',
    'ol',
    'li',
    'blockquote',
    'a',
    'img',
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target'],
    img: ['src'],
    li: ['class'],
  },
  allowedSchemes: ['data', 'http'],
};
export const getPostById = async (ctx, next) => {
  const { id } = ctx.params;
  
  if (!ObjectId.isValid(id)) {
    ctx.status = 400; // Bad Request
    return;
  }
  try {
  
    const post = await Post.findById(id);
    // 포스트가 존재하지 않을 때
    if (!post) {
      ctx.status = 404; // Not Found
      return;
    }
    ctx.state.post = post;
   // return next();
  } catch (e) {
    //console.log('bb');
    ctx.throw(500, e);
  }
  // 댓글 데이터 로딩
  try {
    const comments = await Comment.find({ post: id });
    ctx.state.comments = comments;
  } catch (e) {
    ctx.throw(500, e);
  }

  await next();
};

export const checkOwnPost = (ctx, next) => {
  const { user, post } = ctx.state;
  if (post.user._id.toString() !== user._id) {
    ctx.status = 403;
    return;
  }
  return next();
};

export const write = async ctx => {
  const schema = Joi.object().keys({
    // 객체가 다음 필드를 가지고 있음을 검증
    title: Joi.string().required(), // required()가 있으면 필수 항목
    body: Joi.string().required(),
    tags: Joi.array()
      .items(Joi.string())
      .required(), // 문자열로 이루어진 배열
  });

  // 검증하고 나서 검증 실패인 경우 에러 처리
  const validation = schema.validate(ctx.request.body);
  //const result = Joi.validate(ctx.request.body, schema);
  if (validation.error) {
    ctx.status = 400; // Bad Request
    ctx.body = validation.error;
    return;
  }

  const { title, body, tags } = ctx.request.body;
  const post = new Post({
    title,
    body: sanitizeHtml(body, sanitizeOption),
    tags,
    user: ctx.state.user,
  });
  try {
    await post.save();
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

const removeHtmlAndShorten = body => {
  const filtered = sanitizeHtml(body, {
    allowedTags: [],
  });
  return filtered.length < 200 ? filtered : `${filtered.slice(0, 200)}...`;
};
/*
  GET /api/posts?username=&tag=&page=
*/
export const list = async ctx => {
   // query는 문자열이기 때문에 숫자로 변환해 주어야 합니다.
  // 값이 주어지지 않았다면 1을 기본으로 사용합니다.
  const page = parseInt(ctx.query.page || '1', 10);

  if (page < 1) {
    ctx.status = 400;
    return;
  }

  const { tag, username } = ctx.query;
  // tag, username 값이 유효하면 객체 안에 넣고, 그렇지 않으면 넣지 않음
  const query = {
    ...(username ? { 'user.username': username } : {}),
    ...(tag ? { tags: tag } : {}),
  };
  /*
  try {
    const posts = await Post.find(query)
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .lean()
      .exec();
    const postCount = await Post.countDocuments(query).exec();
    ctx.set('Last-Page', Math.ceil(postCount / 10));
    ctx.body = posts.map(post => ({
      ...post,
      body: removeHtmlAndShorten(post.body),
    }));
  } catch (e) {
    ctx.throw(500, e);
  }
*/
  try {
    const posts = await Post.find(query)
      .sort({ _id: -1 })
      .lean()
      .exec();
    ctx.body = posts.map(post => ({
      ...post,
      body: removeHtmlAndShorten(post.body),
    }));
  } catch (e) {
    ctx.throw(500, e);
  }
    
};

export const writeComment = async (ctx) => {
  const { user } = ctx.state;
  const { postId } = ctx.params;
  const { text } = ctx.request.body;
  
  try {
    const post = ctx.state.post;
    const comment = new Comment({
      text,
      user: user,
      post: post._id,
    });
    await comment.save();
    ctx.body = comment.serialize();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const writeCommentReply = async (ctx) => {
  const { user } = ctx.state;
  const { postId } = ctx.params;
  const { text, parentCommentId } = ctx.request.body;

  try {
    const post = ctx.state.post;

    if (!post) {
      ctx.status = 404; // Not Found
      return;
    }
    const parentComment = await Comment.findById(parentCommentId);
    if (!parentComment) {
      ctx.status = 404;
      return;
    }
    //console.log(parentCommentId);
    //return;
    const comment = new Comment({
      text,
      user,
      post: post._id,
      parentCommentId,
    });
    await comment.save();
    parentComment.replies.push(comment._id);
    await parentComment.save();

    //ctx.body = comment.serialize();
    ctx.body = comment.toJSON();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const listCommentReplies = async (ctx) => {
  const { postId, commentId } = ctx.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      ctx.status = 404; // Not Found
      return;
    }
    const replies = await Comment.find({ parentCommentId: commentId });

 
    ctx.body = replies.map(reply => reply.toJSON());
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const getCommentReplies = async (ctx) => {
  const { postId, commentId } = ctx.params;

  try {
    const response = await listCommentReplies(ctx);
    ctx.body = response;
  } catch (e) {
    ctx.throw(e);
  }
};

/**
 * GET /api/posts/:id/comments
 * 댓글 목록 조회

export const listComments = async (ctx) => {
  const { id } = ctx.params;

  try {
    const comments = await Comment.find({ post: id }).sort({ _id: 1 }).exec();
    ctx.body = comments;
  } catch (e) {
    ctx.throw(500, e);
  }
};
*/
export const listComments = async (ctx) => {
  const { id } = ctx.params;

  try {
    // 1. 댓글과 대댓글을 함께 조회합니다.
    const comments = await Comment.find({ post: id }).sort({ _id: 1 }).exec();
    
    // 2. 조회한 댓글과 대댓글을 구분하여, 각각 다른 배열에 담습니다.
    const topLevelComments = [];
    const replies = {};
    comments.forEach((comment) => {
      if (!comment.parentCommentId) {
        topLevelComments.push(comment);
      } else {
        const parentCommentId = comment.parentCommentId.toString();
        if (!replies[parentCommentId]) {
          replies[parentCommentId] = [];
        }
        replies[parentCommentId].push(comment);
      }
    });

    // 3. 대댓글 배열에서 각 대댓글의 부모 댓글 ID를 참조하여, 해당 부모 댓글을 찾아 그 하위에 대댓글을 추가합니다.
    topLevelComments.forEach((comment) => {
      comment.replies = replies[comment._id.toString()] || [];
    });

    // 4. 댓글과 대댓글이 각각 담긴 두 개의 배열을 합쳐서 클라이언트에 응답합니다.
    ctx.body = topLevelComments;
  } catch (e) {
    ctx.throw(500, e);
  }
};
export const deleteComment = async (ctx) => {
  const { postId, commentId } = ctx.params;

  try {
    await Comment.findByIdAndRemove(commentId).exec();
    ctx.status = 204; // No Content
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const read = ctx => {
  //console.log('cc');
  ctx.body = ctx.state.post;
};

export const remove = async ctx => {
  const { id } = ctx.params;
  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204; // No Content (성공하기는 했지만 응답할 데이터는 없음)
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const update = async ctx => {
  const { id } = ctx.params;
  // write에서 사용한 schema와 비슷한데, required()가 없습니다.
  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });

  // 검증하고 나서 검증 실패인 경우 에러 처리
  //const result = Joi.validate(ctx.request.body, schema);
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }

  const nextData = { ...ctx.request.body }; // 객체를 복사하고
  // body 값이 주어졌으면 HTML 필터링
  if (nextData.body) {
    nextData.body = sanitizeHtml(nextData.body);
  }

  try {
    const post = await Post.findByIdAndUpdate(id, nextData, {
      new: true, // 이 값을 설정하면 업데이트된 데이터를 반환합니다.
      // false일 때는 업데이트되기 전의 데이터를 반환합니다.
    }).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

