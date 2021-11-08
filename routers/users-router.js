const usersRouter = require('express').Router();
const { getUsers, getUser, getReviewsByUsername } = require('../controllers/user.controller.js')
usersRouter.get('/', getUsers)

usersRouter.get('/:username', getUser);
usersRouter.get('/reviews/:username', getReviewsByUsername)
module.exports = usersRouter;