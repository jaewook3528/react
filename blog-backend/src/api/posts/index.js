import Router from 'koa-router';
import * as postsCtrl from './posts.ctrl.js';
import checkLoggedIn from '../../lib/checkLoggedIn.js';
import checkCommentOwn from '../../lib/checkCommentOwn.js';


const posts = new Router();

posts.get('/', postsCtrl.list);
posts.post('/', checkLoggedIn, postsCtrl.write);

const post = new Router(); // /api/posts/:id
post.get('/', postsCtrl.read);
post.delete('/', checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.remove);
post.patch('/', checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.update);

// 새로 추가된 라우트
post.post('/comments', checkLoggedIn, postsCtrl.writeComment);
post.delete('/comments/:commentId', checkLoggedIn, checkCommentOwn, postsCtrl.deleteComment);

posts.use('/:id', postsCtrl.getPostById, post.routes());

export default posts;