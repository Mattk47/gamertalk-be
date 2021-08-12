const { selectCategories, addCategory } = require('../models/categories.models.js')

exports.getCategories = (req, res, next) => {
    selectCategories().then(categories => {
        res.status(200).send({ categories })
    }).catch(() => { next(err) })
}

exports.postCategory = (req, res, next) => {
    const category = req.body
    addCategory(category).then(newCategory => {
        res.status(201).send({ newCategory })
    }).catch(next)
}
