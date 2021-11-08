const { selectReview, updateReviewVotes, selectReviews, selectCommentsByReview_id, addComment, addReview, removeReview } = require('../models/review.models')

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
    const { sort_by, order, category, limit, page } = req.query;
    selectReviews(sort_by, order, category, limit, page).then((reviews) => {
        if (reviews.length === 0) return Promise.reject({ status: 404, msg: 'No content found' })
        const total_count = reviews.length;
        res.status(200).send({ reviews, total_count })
    }).catch(next)
}

exports.getCommentsById = (req, res, next) => {
    const { review_id } = req.params
    const { limit, page } = req.query;
    selectCommentsByReview_id(review_id, limit, page).then(comments => {
        res.status(200).send({ comments })
    }).catch(next)
}

exports.postComment = (req, res, next) => {
    const { username, body } = req.body;
    const { review_id } = req.params;
    addComment(review_id, username, body).then(comment => {
        res.status(201).send({ comment })
    }).catch(next)
}

exports.postReview = (req, res, next) => {
    const review = req.body
    addReview(review).then(addedReview => {
        res.status(201).send({ addedReview })
    }).catch(next)
}

exports.deleteReview = (req, res, next) => {
    const { review_id } = req.params
    removeReview(review_id).then(() => {
        res.status(204).send();
    }).catch(next)
}

