const reviewsRouter = require('express').Router();
const { getReviewById, patchReviewVotes } = require('../controllers/reviews.controller')

reviewsRouter.route('/')
    .get()

reviewsRouter.route('/:review_id')
    .get(getReviewById)
    .patch(patchReviewVotes)

reviewsRouter.route('/:review_id/comments')
    .get()
    .post()
module.exports = reviewsRouter;