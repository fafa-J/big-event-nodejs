const express = require('express')
const router = express.Router()
const db = require('../db')
const jwt = require('jsonwebtoken')
const utility = require('utility')

//登录
router.post('/login', async (req, res) => {

    let r = await db('select * from user where username=? and password=?', [req.body.username, utility.md5(req.body.password)])
    // console.log(r);

    if (r && r.length > 0) {

        res.json({
            "status": 0,
            "message": "登录成功！",
            // token: 'Bearer ' + jwt.sign(要保存的信息, 秘钥, 配置项)
            // 生成的token前面必须有Bearer，还有一个空格。否则一会token不能正常的解密
            // expiresIn 值是字符串时 为毫秒 ， 值是数值时 为秒
            token: 'Bearer ' + jwt.sign({ username: r[0].username, id: r[0].id }, 'bigevent-9760', { expiresIn: 20000 })
        })
    } else {
        res.json({
            "status": 1,
            "message": "登录失败！",
        })
    }
})


//注册
router.post('/reguser', async (req, res) => {
    //密码的md5加密
    req.body.password = utility.md5(req.body.password)
    let r = await db('insert into user set ?', req.body)
    // console.log(r);
    /* 
    OkPacket {
  fieldCount: 0,
  affectedRows: 1,
  insertId: 1,
  serverStatus: 2,
  warningCount: 0,
  message: '',
  protocol41: true,
  changedRows: 0
}
    */
    if (r && r.affectedRows > 0) {
        res.json({
            status: 0,
            message: '注册成功'
        });
    } else {
        res.json({
            status: 1,
            message: '注册失败'
        });
    }
})

module.exports = router