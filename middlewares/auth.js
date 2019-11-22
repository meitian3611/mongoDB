//用户认证的中间件

const auth = (req, res, next) => {
    if (req.session.userInfo) {
        next()
    } else {
        res.redirect('/login')
    }
}

module.exports = auth