// post表相关的model文件

// 1. 引入之前已经链接到mongdb数据库的mongoose模块
const mongoose = require('../config/db')

// 2. 实例化一个 schema(描述表的结构的东西)
const schema = new mongoose.Schema({
    //键值对，key：表的字段名 value：这个字段的类型

    title: {//文章标题
        type: String,
        required: true
    },
    body: {//文章正文
        type: String,
        required: true
    }
})


// 3. 通过 mongoose.model()生成当前post 的model
// 第一个参数，是我们的表名的单数形式
const model = mongoose.model('post', schema)

// 4. 暴露出去
module.exports = model