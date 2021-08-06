const format = require('pg-format');
const db = require('../connection')

exports.checkExists = (table, column, value) => {
    const queryStr = format('SELECT * FROM %I WHERE %I = $1;', table, column);
    return db.query(queryStr, [value]).then(result => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Resource not found' });
        }
    })


};