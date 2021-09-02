const db = require('../db/connection')
const { checkExists } = require('../db/utils/utils')

exports.selectReview = (review_id) => {
    return db.query(`SELECT reviews.*, COUNT(comments.body) as comment_count FROM reviews 
    LEFT JOIN comments ON reviews.review_id = comments.review_id
                     WHERE reviews.review_id = $1
                     GROUP BY reviews.review_id`, [review_id])
        .then((reviewData) => {
            if (!reviewData.rows.length) {
                return Promise.reject({ status: 404, msg: 'Resource not found' })
            }
            return reviewData.rows[0]
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
            return reviewData.rows[0];
        })
}

exports.selectReviews = async (sort_by = 'created_at', order = 'desc', category, limit = 5, page = 1) => {
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
    if (!validColumns.includes(sort_by)) {
        return Promise.reject({
            status: 400,
            msg: `Bad request`,
        });
    }

    if (category) {
        let getCategories = await db.query(`SELECT categories.slug FROM categories`)
        const validCategories = []
        getCategories.rows.forEach(slugObj => {
            validCategories.push(slugObj.slug)
        })
        if (!validCategories.includes(category)) {
            return Promise.reject({
                status: 400,
                msg: `Invalid category query`,
            });
        }
    }

    if (!['asc', 'desc'].includes(order)) {
        return Promise.reject({ status: 400, msg: 'Invalid order query' });
    }

    const offset = (page - 1) * limit
    let queryStr = `SELECT reviews.*, COUNT(comments.body) as comment_count FROM reviews 
    LEFT JOIN comments ON reviews.review_id = comments.review_id`

    if (category) {
        return db.query(`${queryStr}
        WHERE category = $1
        GROUP BY reviews.review_id
        ORDER BY ${sort_by} ${order}
        LIMIT ${limit}
        OFFSET ${offset};`, [category])

            .then((reviewData) => {
                return reviewData.rows
            })
    } else {
        return db.query(`${queryStr}
                     GROUP BY reviews.review_id
                     ORDER BY ${sort_by} ${order}
                     LIMIT ${limit}
                     OFFSET ${offset};`)
            .then((reviewData) => {
                return reviewData.rows
            })
    }

}

exports.selectCommentsByReview_id = (review_id, limit = 10, page = 1) => {
    const offset = (page - 1) * limit
    return db.query(`SELECT comments.* FROM comments 
    JOIN reviews ON reviews.review_id = comments.review_id
    WHERE comments.review_id = $1 LIMIT $2 OFFSET ${offset};`, [review_id, limit])
        .then(dbResults => {
            if (dbResults.rows.length === 0) {
                return checkExists('reviews', 'review_id', review_id)
                    .then(() => {
                        return dbResults.rows;
                    })

            }
            return dbResults.rows;
        })
}

exports.addComment = (review_id, username, body) => {
    if (!username || !body) {
        return Promise.reject({
            status: 400,
            msg: 'Bad request',
        });
    }

    return db.query(`INSERT INTO comments(author, body, review_id) VALUES ($1, $2, $3) RETURNING*`,
        [username, body, review_id])
        .then(commentData => {

            return commentData.rows[0]
        })

}

exports.addReview = (review) => {
    const { owner, title, review_body, designer, category, review_img_url } = review
    if (!owner || !title || !review_body || !designer || !category) {
        return Promise.reject({
            status: 400,
            msg: 'Bad request',
        });
    }
    return db.query(`INSERT INTO reviews(owner, title, review_body,
         designer, category, review_img_url) VALUES($1, $2, $3, $4, $5, $6)
         RETURNING*;`, [owner, title, review_body, designer, category, review_img_url])
        .then(commentData => {
            return commentData.rows[0];
        })
}

exports.removeReview = (review_id) => {
    return db.query(`DELETE FROM reviews WHERE review_id = $1 RETURNING*`
        , [review_id]).then(deletedData => {
            if (deletedData.rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Resource not found' })
            }
        })
}
