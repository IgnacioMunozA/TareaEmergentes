const db = require('./database.js');

function dball(sql, params) {
  return new Promise((resolve, reject) =>
    db.all
        (sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
            })
    );
}

module.exports = {dball};