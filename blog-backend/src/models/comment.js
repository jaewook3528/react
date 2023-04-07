import mongoose from 'mongoose';

const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: {
      _id: mongoose.Types.ObjectId,
      username: String,
    },
    post: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Post',
    },
  },
  {
    timestamps: true,
  },
);

CommentSchema.methods.serialize = function () {
    const data = this.toJSON();
    data.id = data._id;
    delete data._id;
    delete data.__v;
    return data;
};

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;