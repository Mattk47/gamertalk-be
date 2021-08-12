const { removeComment, updateComment } = require('../models/comments.models')

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params
    removeComment(comment_id).then(() => {
        res.status(204).send()
    }).catch(next)
}

exports.patchComment = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    updateComment(comment_id, inc_votes).then(updatedComment => {
        res.status(201).send({ updatedComment })
    }).catch(next)
}