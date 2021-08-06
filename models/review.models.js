const db = require('../db/connection')
const { checkExists } = require('../db/utils/utils')

exports.selectReview = (review_id) => {
    return db.query(`SELECT reviews.*, COUNT(comments.body) as comment_count FROM reviews 
    JOIN comments ON reviews.review_id = comments.review_id
                     WHERE reviews.review_id = $1
                     GROUP BY reviews.review_id`, [review_id])
        .then((reviewData) => {
            if (!reviewData.rows.length) {
                return checkExists('reviews', 'review_id', review_id);
            }
            return reviewData.rows
        })
}

exports.updateReviewVotes = (inc_votes, review_id) => {
    if (!inc_votes) {
        return Promise.reject({
            status: 400,
            msg: 'Bad request',
        });
    }
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

exports.selectReviews = (sort_by = 'created_at', order = 'desc', category) => {
    const validColumns = [
        'owner',
        'title',
        'review_id',
        'category',
        'review_img_url',
        'created_at',
        'votes',
        'comment_count'
    ]
    if (category) {
        const validCategories = [
            'strategy',
            'hidden-roles',
            'dexterity',
            'push-your-luck',
            'roll-and-write',
            'deck-building',
            'engine-building',
            'social deduction',
            'euro game'
        ]
        if (!validCategories.includes(category)) {
            return Promise.reject({
                status: 400,
                msg: `Invalid category query`,
            });
        }

    }
    if (!validColumns.includes(sort_by)) {
        return Promise.reject({
            status: 400,
            msg: `Bad request`,
        });
    }

    if (!['asc', 'desc'].includes(order)) {
        return Promise.reject({ status: 400, msg: 'Invalid order query' });
    }
    let queryStr = `SELECT reviews.*, COUNT(comments.body) as comment_count FROM reviews 
    JOIN comments ON reviews.review_id = comments.review_id`
    if (category) {
        return db.query(`${queryStr}
        WHERE category = $1
        GROUP BY reviews.review_id
        ORDER BY ${sort_by} ${order};`, [category])
            .then((reviewData) => {
                return reviewData.rows
            })
    } else {
        return db.query(`${queryStr}
                     GROUP BY reviews.review_id
                     ORDER BY ${sort_by} ${order};`)
            .then((reviewData) => {
                return reviewData.rows
            })
    }

}

exports.selectCommentsByReview_id = (review_id) => {
    return db.query(`SELECT comments.author, comments.comment_id, comments.body,
     comments.votes, comments.created_at FROM comments 
    JOIN reviews ON reviews.review_id = comments.review_id
    WHERE comments.review_id = $1;`, [review_id])
        .then(dbResults => {
            if (dbResults.rows.length === 0) {
                console.log('in hereee')
                return checkExists('reviews', 'review_id', review_id)
                    .then(() => {
                        return dbResults.rows;
                    })
            }
            return dbResults.rows;
        })
}

exports.addComment = (review_id, comment) => {
    const { username, body } = comment
    return db.query(`INSERT INTO comments(author, body, review_id) VALUES ($1, $2, $3) RETURNING*`,
        [username, body, review_id])
        .then(comment => {
            console.log(comment.rows)
            return comment.rows
        })

}
