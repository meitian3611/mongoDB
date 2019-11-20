const express = require('express')
const app = express()

//引入数据库相关model文件
const PostModel = require('./models/post')


//req.body中间件的设置
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


//新增文章
app.post('/api/posts', async (req, res) => {
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
app.get('/api/posts', async (req, res) => {
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
app.delete('/api/posts/:id', async (req, res) => {
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
app.put('/api/posts/:id/update', async (req, res) => {
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


app.listen(8080)