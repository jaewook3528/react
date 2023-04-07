const checkCommentOwn = async (ctx, next) => {
    const { user, comment } = ctx.state;
    if (comment.user._id.toString() !== user._id) {
      ctx.status = 403; // Forbidden
      return;
    }
    await next();
  };

  export default checkCommentOwn;