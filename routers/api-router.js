const apiRouter = require('express').Router();

const reviewsRouter = require('./reviewRouter');
const commentsRouter = require('../routers/comments-router')
const usersRouter = require('../routers/users-router')

const { getCategories, postCategory } = require('../controllers/categories.controller')
const { getEndpoints } = require('../controllers/endpoints.js')

apiRouter.use('/reviews', reviewsRouter);

apiRouter.use('/comments', commentsRouter);

apiRouter.use('/users', usersRouter);


apiRouter.route('/').get(getEndpoints)

apiRouter.get('/categories', getCategories)
apiRouter.post('/categories', postCategory)



module.exports = apiRouter;