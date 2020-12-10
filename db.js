/*
封装数据库方法---promise
*/


function db(sql, params = null) {

    const mysql = require('mysql')

    const conn = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'root',
        database: 'big-event'
    })


    //返回promise对象
    return new Promise((resolve, reject) => {
        //内部装异步逻辑
        conn.connect()

        conn.query(sql, params, (err, result) => {
            err ? reject(err) : resolve(result)
        })

        conn.end()
        //统一处理catch逻辑
    }).catch(err => {
        console.log(err);
    })

}

module.exports = db