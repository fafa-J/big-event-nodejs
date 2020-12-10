const express = require('express')
const router = express.Router()
const db = require('../db')
const utility = require('utility')

//获取用户信息
/* 
1.拿用户的 username或者id (从token中拿)
2.查数据库
*/
router.get('/userinfo', async (req, res) => {
    //从token取username
    // console.log(req.user.username);
    let r = await db('select * from user where username=?', req.user.username)
    // console.log(r);
    if (r && r.length > 0) {
        res.json({
            status: 0,
            message: '用户信息获取成功',
            data: r[0]
        })
    } else {
        res.json({
            status: 1,
            message: '用户信息获取失败',
        })
    }
})

//更新用户信息
router.post('/userinfo', async (req, res) => {
    // console.log(req.body);
    //封装sql参数
    let obj = {
        nickname: req.body.nickname,
        email: req.body.email
    }
    //sql语句
    let r = await db('update user set ? where id =?', [obj, req.body.id])

    console.log(r);

    if (r && r.affectedRows > 0) {
        res.json({
            status: 0,
            message: '修改用户信息成功！'
        })
    } else {
        res.json({
            status: 1,
            message: '修改用户信息失败！'
        })
    }
})


//更新密码
/* 
1.判断新旧密码是否相等
2.验证原密码是否正确
3.更新密码执行sql
*/
router.post('/updatepwd', async (req, res) => {
    let oldPwd = req.body.oldPwd
    let newPwd = req.body.newPwd

    if (oldPwd === newPwd) {
        res.json({
            status: 1,
            message: '新旧密码相同'
        })
        return
    }

    let r = await db('select * from user where username=? and password=?', [req.user.username, utility.md5(oldPwd)])

    if (!r || r.length <= 0) {
        res.json({
            status: 1,
            message: '原密码错误'
        })
        return
    }

    let result = await db('update user set password=? where username=?', [utility.md5(newPwd), req.user.username])

    if (result && result.affectedRows > 0) {
        res.json({
            status: 0,
            message: '密码更新成功'
        })
    } else {
        res.json({
            status: 1,
            message: '密码更新失败'
        })
    }
})

//更新头像
router.post('/update/avatar', async (req, res) => {
    // console.log(req.body.avatar);
    let r = await db('update user set user_pic = ? where username=?', [req.body.avatar, req.user.username])
    if (r && r.affectedRows > 0) {
        res.json({
            status: 0,
            message: '头像更新成功'
        })
    } else {
        res.json({
            status: 1,
            message: '头像更新失败'
        })
    }
})



module.exports = router