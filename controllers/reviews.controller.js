const { selectReview, updateReviewVotes } = require('../models/review.models')

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