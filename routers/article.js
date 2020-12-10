const express = require('express')
const router = express.Router()
const db = require('../db')
const multer = require('multer')
const path = require('path')
//配置上传文件的存放目录
//const upload = multer({ dest: '路径' })
const upload = multer({ dest: path.join(__dirname, '../uploads') })

const moment = require('moment')
const fs = require('fs')

//设置路由

//新增文章
router.post('/add', upload.single('cover_img'), async (req, res) => {

    //获取fd数据 配置multer接收fd数据 ,
    //文本内容： req.body, 上传文件相关内容： req.file,其中filename是上传到服务器的文件名
    let reqBody = req.body
    //处理数据
    let obj = {
        title: reqBody.title,
        content: reqBody.content,
        cate_id: reqBody.cate_id,
        state: reqBody.state,
        cover_img: req.file.filename,
        pub_date: moment().format('YYYY-MM-DD hh:mm:ss'),//'2020-03-11 23:15:25',
        //token存的id
        author_id: req.user.id
    }

    //数据库
    let r = await db('insert into article set ?', obj)
    //响应结果
    if (r && r.affectedRows > 0) {
        res.json({
            status: 0,
            message: '发布文章成功！'
        })
    } else {
        //当失败时，需要删除上传的文件 fs删除即可

        res.json({
            status: 1,
            message: '发布文章失败！'
        })
    }
})

//获取文章列表______________________________________________________________________
router.get('/list', async (req, res) => {
    //解构赋值
    let { pagenum, pagesize, cate_id, state } = req.query
    console.log(pagenum, pagesize);
    //判断参数完整
    if (!(pagenum || pagesize)) {
        res.json({
            status: 1,
            message: "页码或者每页大小参数缺失"
        })
        return
    }
    //处理查询条件：拼sql串

    let str = ''
    //分类id的条件
    if (cate_id) {
        str += ' and a.cate_id=' + cate_id
    }

    if (state) {
        str += ' and a.state= "' + state + '"'
    }
    //sql语句
    let sqlCount = `select count(*) as total from article a where a.author_id = ${req.user.id} ${str}`
    let a = await db(sqlCount)
    if (!a) {
        res.json({
            status: 1,
            message: '获取文章总数失败'
        })
        return
    }

    let sql = `select a.Id,a.title,a.cate_id,a.pub_date,a.state,c.name cate_name from article a  join category  c on a.cate_id=c.id  where a.author_id = ${req.user.id} ${str} limit ${(pagenum - 1) * pagesize}, ${pagesize}`
    let r = await db(sql)
    if (r) {
        res.json({
            "status": 0,
            "message": "获取文章列表成功！",
            "data": r,
            "total": a[0].total
        })

    } else {
        res.json({
            "status": 1,
            "message": "获取文章列表失败！",
        })
    }
})

//id删文章
router.get('/delete/:id', async (req, res) => {
    let id = req.params.id;
    let r = await db('delete from article where id = ?', id)
    if (r && r.affectedRows > 0) {
        res.json({
            "status": 0,
            "message": "删除成功！"
        })
    } else {
        res.json({
            "status": 1,
            "message": "删除失败！"
        })
    }
})

//id获取文章详情
router.get('/:id', async (req, res) => {
    let id = req.params.id
    let r = await db('select * from article where Id=?', id)
    if (r && r.length > 0) {
        res.json({
            "status": 0,
            "message": "获取文章成功！",
            "data": r[0]
        })
    } else {
        res.json({
            "status": 1,
            "message": "获取文章失败！",
        })
    }
})

//id改文章
router.post('/edit', upload.single('cover_img'), async (req, res) => {
    //获取fd数据 配置multer接收fd数据 ,
    //文本内容： req.body, 上传文件相关内容： req.file,其中filename是上传到服务器的文件名
    let reqBody = req.body
    //处理数据
    let obj = {
        title: reqBody.title,
        content: reqBody.content,
        cate_id: reqBody.cate_id,
        state: reqBody.state,
        cover_img: req.file.filename,
    }
    let r = await db('update article set ? where Id =?', [obj, reqBody.Id])
    if (r && r.affectedRows > 0) {
        res.json({
            status: 0,
            message: '修改文章成功！'
        })
    } else {
        res.json({
            status: 1,
            message: '修改文章失败！'
        })
    }
})

module.exports = router