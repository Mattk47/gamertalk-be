const { selectCategories } = require('../models/models')

exports.getCategories = (req, res, next) => {
    selectCategories().then(categories => {
        res.status(200).send({ categories })
    }).catch(() => { next(err) })
}

