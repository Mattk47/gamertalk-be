const reviewsRouter = require('express').Router();
const { getReviewById, patchReviewVotes, getReviews, getCommentsById, postComment, postReview, deleteReview } = require('../controllers/reviews.controller')

reviewsRouter.route('/')
    .get(getReviews)
    .post(postReview)

reviewsRouter.route('/:review_id')
    .get(getReviewById)
    .patch(patchReviewVotes)
    .delete(deleteReview)

reviewsRouter.route('/:review_id/comments')
    .get(getCommentsById)
    .post(postComment)
module.exports = reviewsRouter;