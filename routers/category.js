const express = require('express')
const router = express.Router()
const db = require('../db')

//获取文章分类列表
router.get('/cates', async (req, res) => {
    let r = await db('select * from category')
    if (r) {
        res.json({
            status: 0,
            message: '获取文章分类列表成功',
            data: r
        })
    } else {
        res.json({
            status: 1,
            message: '获取文章分类列表失败',
        })
    }
})

//新增分类
router.post("/addcates", async (req, res) => {

    let r = await db('insert into category set ?', req.body)
    if (r && r.affectedRows > 0) {
        res.json({
            "status": 0,
            "message": "新增文章分类成功！"
        })
    } else {
        res.json({
            "status": 1,
            "message": "新增文章分类失败！"
        })
    }
})

//根据id删除文章分类， 动态参数/:id
//获取动态参数req.params.参数名
router.get('/deletecate/:id', async (req, res) => {
    let id = req.params.id
    let r = await db('delete  from category where id=?', id)
    if (r && r.affectedRows > 0) {
        res.json({
            "status": 0,
            "message": "删除文章分类成功！"
        })
    } else {
        res.json({
            "status": 1,
            "message": "删除文章分类失败！"
        })
    }
})

//根据id更新文章分类
router.post('/updatecate', async (req, res) => {

    let r = await db('update category set ? where id=?', [req.body, req.body.Id])
    if (r && r.affectedRows > 0) {
        res.json({
            "status": 0,
            "message": "更新分类信息成功！"
        })
    } else {
        res.json({
            "status": 1,
            "message": "更新分类信息失败！"
        })
    }
})

module.exports = router