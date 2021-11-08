const db = require('../db/connection')

exports.selectUsers = () => {
    return db.query(`SELECT users.username FROM users`).then(usersData => {
        return usersData.rows
    })
}

exports.selectUserByUsername = (username) => {
    return db.query(`SELECT * FROM users WHERE username = $1`, [username])
        .then(userData => {
            if (userData.rows.length === 0) return Promise.reject({ status: 404, msg: 'Resource not found' })
            return userData.rows[0];
        })
}

exports.selectReviewsByUsername = (username) => {
    return db.query('SELECT * FROM reviews WHERE owner = $1', [username])
        .then(reviewData => { return reviewData.rows })
}