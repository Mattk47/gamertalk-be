const { selectReview, updateReviewVotes, selectReviews, selectCommentsByReview_id, addComment } = require('../models/review.models')

exports.getReviewById = (req, res, next) => {
    const { review_id } = req.params;
    selectReview(review_id).then((review) => {
        res.status(200).send({ review })
    }).catch(next)
}

exports.patchReviewVotes = (req, res, next) => {
    const { inc_votes } = req.body
    const { review_id } = req.params;
    updateReviewVotes(inc_votes, review_id).then(updatedReview => {
        res.status(201).send({ updatedReview })
    }).catch(next)
}

exports.getReviews = (req, res, next) => {
    const { sort_by, order, category } = req.query;
    selectReviews(sort_by, order, category).then((reviews) => {
        res.status(200).send({ reviews })
    }).catch(next)
}

exports.getCommentsById = (req, res, next) => {
    const { review_id } = req.params
    selectCommentsByReview_id(review_id).then(comments => {
        res.status(200).send({ comments })
    }).catch(next)
}

exports.postComment = (req, res, next) => {
    const { comment } = req.body;
    const { review_id } = req.params;
    addComment(review_id, comment).then(comment => {
        res.status(201).send({ comment })
    })
}