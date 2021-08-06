const express = require('express');
const app = express()
const apiRouter = require('./routers/api-router')
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require('./errors')
app.use(express.json())
app.use('/api', apiRouter);

app.all('/*', (req, res) => {
    res.status(404).send({ msg: 'Route not found' });
});

app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors)


module.exports = app