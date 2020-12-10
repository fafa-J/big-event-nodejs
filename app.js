/* 
1.创建项目文件夹并初始化，安装第三方模块
2.创建路由模块
3.创建主文件，开启服务
*/
const path = require('path')
const express = require('express')
const app = express()

app.listen(3007, () => { console.log('大事件服务器启动！'); })

//应用级配置

const cors = require('cors')
app.use(cors())

app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'uploads')))
//配置登录认证
// 使用express-jwt模块，控制 以 /my 开头的接口，需要正确的token才能访问
const expressJWT = require('express-jwt');
// unless ： 如果没有 unless方法，则默认所有接口都需要验证，unless把不需要验证的接口排除掉。
/* 
secret : 加密秘钥
algorithms ： 加密算法 ['HS256']
path 取值范围：
  字符串：表示排除一个地址 如 '/api/login'
  数组： 表示排除多个地址 如 ['/api/login', ]
  正则： 表示排除符合规则的地址 如 /^\/api/  (排除以 /api开头的接口)
*/
app.use(expressJWT({ secret: 'bigevent-9760', algorithms: ['HS256'] }).unless({ path: /^\/api/ }))


//加载并使用路由
const login = require(path.join(__dirname, 'routers', 'login'))
app.use('/api', login)

app.use('/my', require(path.join(__dirname, 'routers', 'user')))
app.use('/my/article', require(path.join(__dirname, 'routers', 'category')))
app.use('/my/article', require(path.join(__dirname, 'routers', 'article')))

// 错误配置，统一处理tokne的问题
app.use((err, req, res, next) => {
    // 真的token问题，做判断
    if (err.name === 'UnauthorizedError') {
        console.log(err.message);
        res.json({
            status: 1,
            message: '身份认证失败！'
        });
    }
});
