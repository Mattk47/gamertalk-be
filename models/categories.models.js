const db = require('../db/connection')

exports.selectCategories = () => {
    return db.query('SELECT * FROM categories')
        .then(result => {
            return result.rows;
        })
}

exports.addCategory = (category) => {
    const { slug, description } = category;
    if (!slug || !description) return Promise.reject({ status: 400, msg: 'Bad request' })
    return db.query(`INSERT INTO categories(slug, description)
    VALUES($1, $2) RETURNING*;`, [slug, description])
        .then(categoryData => {
            return categoryData.rows[0]
        })
}