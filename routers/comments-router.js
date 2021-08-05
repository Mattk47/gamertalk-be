const commentsRouter = require('express').Router();

commentsRouter.route('/')
    .delete()
    .patch()


module.exports = commentsRouter;