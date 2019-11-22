const express = require('express')
const session = require('express-session')
const path = require('path')
const app = express()

//引入拆分出去的路由
const postRouter = require('./routes/post')
const userRouter = require('./routes/user')

//使用那种模板引擎，模板页面的存放路径
app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, './views'))


//req.body中间件的设置
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//静态资源的托管
app.use(express.static(path.resolve(__dirname, './public')))

// 设置session相关的中间件
app.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret: 'assd',
        cookie: {
            maxAge: 60 * 1000 * 60
        }
    })
)
app.use(postRouter)
app.use(userRouter)

app.listen(8080)