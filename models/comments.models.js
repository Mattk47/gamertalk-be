const db = require('../db/connection');

exports.removeComment = (comment_id) => {
    return db.query('DELETE FROM comments WHERE comment_id = $1 RETURNING*', [comment_id])
        .then(deleteData => {
            if (deleteData.rows.length === 0) return Promise.reject({ status: 404, msg: 'Resource not found' })
        })
}

exports.updateComment = (comment_id, inc_votes) => {
    if (!inc_votes) return Promise.reject({ status: 400, msg: 'Bad request' })

    return db.query('UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING*',
        [inc_votes, comment_id]).then(commentData => {
            if (commentData.rows.length === 0) return Promise.reject({ status: 404, msg: 'Resource not found' })
            return commentData.rows[0]
        })
}