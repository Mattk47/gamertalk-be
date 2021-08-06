const reviewsRouter = require('express').Router();
const { getReviewById, patchReviewVotes, getReviews, getCommentsById, postComment } = require('../controllers/reviews.controller')

reviewsRouter.route('/')
    .get(getReviews)

reviewsRouter.route('/:review_id')
    .get(getReviewById)
    .patch(patchReviewVotes)

reviewsRouter.route('/:review_id/comments')
    .get(getCommentsById)
    .post(postComment)
module.exports = reviewsRouter;