const apiRouter = require('express').Router();

const reviewsRouter = require('./reviewRouter');
const commentsRouter = require('../routers/comments-router')
const usersRouter = require('../routers/users-router')

const { getCategories } = require('../controllers/categories.controller')

apiRouter.use('/reviews', reviewsRouter);

apiRouter.use('/comments/:comment_id', commentsRouter);

apiRouter.use('/users', usersRouter);


apiRouter.route('/').get()

apiRouter.get('/categories', getCategories)


module.exports = apiRouter;