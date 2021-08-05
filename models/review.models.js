const db = require('../db/connection')

exports.selectReview = (review_id) => {
    return db.query(`SELECT reviews.*, COUNT(comments.body) as comment_count FROM reviews 
    JOIN comments ON reviews.review_id = comments.review_id
                     WHERE reviews.review_id = $1
                     GROUP BY reviews.review_id`, [review_id])
        .then((reviewData) => {
            const review = reviewData.rows[0];
            if (!review) {
                return Promise.reject({
                    status: 404,
                    msg: `No user found for user_id: ${review_id}`,
                });
            }
            return reviewData.rows
        })
}

exports.updateReviewVotes = (inc_votes, review_id) => {

    if ()
        return db.query(`UPDATE reviews SET votes = votes + $1 
    WHERE review_id = $2 RETURNING*;`, [inc_votes, review_id])
            .then(reviewData => {
                const review = reviewData.rows[0]
                if (!review) {
                    return Promise.reject({
                        status: 404,
                        msg: `No user found for user_id: ${review_id}`,
                    });
                }
                return reviewData.rows
            })
}
