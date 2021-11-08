const { selectUsers, selectUserByUsername, selectReviewsByUsername } = require('../models/user.models')

exports.getUsers = (req, res, next) => {
    selectUsers().then((users => {
        res.status(200).send({ users })
    })).catch(next)
}

exports.getUser = (req, res, next) => {
    const { username } = req.params
    selectUserByUsername(username).then(user => {
        res.status(200).send({ user })
    }).catch(next)
}

exports.getReviewsByUsername = (req, res, next) => {
    const { username } = req.params
    console.log(username)
    selectReviewsByUsername(username).then((reviews) => {
        console.log(reviews)
        res.status(200).send({ reviews })
    }).catch(next)
}