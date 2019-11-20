// 链接mongodb数据库的文件


// 1. 引入 mongoose
const mongoose = require('mongoose')

// 2. 定义链接的地址
const url = 'mongodb://127.0.0.1:27017/express'

// 3. 通过 mongoose.connect()去链接，方法返回的是一个 promise 对象
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        //链接成功
        console.log('数据库链接成功');
    })
    .catch(error => {
        //链接失败
        console.log('数据库链接失败');
        console.log(error);
    })

// 4. 将已经链接到 mongodb 的 mongoose 模块给暴露出去
module.exports = mongoose