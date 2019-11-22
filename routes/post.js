//处理文章相关的路由

const express = require('express')

const router = express.Router()

//引入数据库相关model文件
const PostModel = require('../models/post')

const auth = require('../middlewares/auth')

//新增文章
router.post('/api/posts', async (req, res) => {
    //获取前端传递过来的参数 req.body
    // 写入数据库
    const post = new PostModel(req.body)
    try {
        const data = await post.save()
        console.log(data);

        res.send({
            code: 0,
            msg: 'ok'
        })

    } catch (error) {
        console.log(error);
        res.send({
            code: -1,
            msg: '出错了'
        })
    }
})


//查询文章
router.get('/api/posts', async (req, res) => {
    //1. 取出前端传递过来的参数
    let pageNum = parseInt(req.query.pageNum) || 1
    let pageSize = parseInt(req.query.pageSize) || 5
    let title = req.query.title

    //2. 获取文章列表
    const posts = await PostModel.find({ title: new RegExp(title) })
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)

    //获取文章总条数
    const count = await PostModel.find({
        title: new RegExp(title)
    }).countDocuments()

    //4.响应给前端
    res.send({
        code: 0,
        msg: 'ok',
        data: {
            list: posts,
            count
        }
    })
})

//删除文章
router.delete('/api/posts/:id', async (req, res) => {
    //1. 取出需要删除的文章id
    let id = req.params.id

    //2. 删除
    await PostModel.findOneAndDelete(id)

    //3. 响应
    res.send({
        code: 0,
        msg: 'ok'
    })
})

//修改文章
router.put('/api/posts/:id/update', async (req, res) => {
    // 1. 取出需要删除的id
    let id = req.params.id

    //2. 取出要修改的内容
    let title = req.body.title

    //3. 找到对应的文章并修改
    await PostModel.updateOne({ _id: id }, req.body)

    res.send({
        code: 0,
        msg: 'ok'
    })
})




//文章列表
router.get('/posts', auth, async (req, res) => {
    //获取分页的参数
    let pageNum = parseInt(req.query.pageNum) || 1
    let pageSize = parseInt(req.query.pageSize) || 5

    const posts = await PostModel.find().skip((pageNum - 1) * pageSize).limit(pageSize).sort({ _id: -1 })

    //获取总条数
    const count = await PostModel.find().countDocuments()
    //根据总页数，算出总条数
    const totalPages = Math.ceil(count / pageSize)

    res.render('post/index', { posts, totalPages, pageNum })

})

//文章新增
router.get('/posts/create', auth, async (req, res) => {
    res.render('post/create')
})
//文章新增处理
router.post('/posts/store', auth, async (req, res) => {
    // console.log(req.body);
    //把前端的数据写入数据库
    const post = new PostModel(req.body)
    await post.save()

    res.redirect('/posts')
})

//文章详情
router.get('/posts/:id', auth, async (req, res) => {
    let id = req.params.id

    const post = await PostModel.findOne({ _id: id })

    res.render('post/show', { post })
})
//end 暴露出去
module.exports = router