var express = require('express');
var credentials = require('./credentials.js');
var session = require('express-session');
var mongoose = require('./config/mongoose.js');
var bodyParser = require('body-parser');
var Card = require('./models/Card.js');

//路由配置
var routes = require('./routes');

var app = express();

//设置端口
app.set('port',process.env.PORT || 3031);

//创建handlebars视图引擎
var handlebars = require('express3-handlebars')
	.create({defaultLayout: 'main',
			extname: '.hbs',
			helpers: {
				section: function(name,options){
					if(!this._sections) this._sections = {};
					this._sections[name] = options.fn(this);
					return null;
				}
			}
		},
	);
app.engine('hbs',handlebars.engine);
app.set('view engine','hbs');

//模板段落中间件
app.use(function(req,res,next){
	if(!res.locals.partials) res.locals.partials = {};
	Card.find(function(err,docs){
		res.locals.partials.travelCard = docs;
	})
	next();
})



//连接数据库
var db = mongoose();

//引入Cookie与内存存储
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(session({
	secret: 'cookieSecret',//作为服务器端生成session的签名
 	resave: true,          //(是否允许)当客户端并行发送多个请求时，其中一个请求在另一个请求结束时对session进行修改覆盖并保存。
	saveUninitialized:false, //初始化session时是否保存到存储。
	cookie: {
		maxAge: 1000 * 60 * 5  //设置session的有效时间，单位毫秒
	} 
}));

//post请求URL解析
app.use(bodyParser.urlencoded({
	  extended: false
}))

//配置资源目录
app.use(express.static(__dirname + '/public'));

//路由目录
routes(app);

app.listen(app.get('port'),function(){
	console.log('Express started on http://localhost:' +
		app.get('port') + '; press Ctrl-c to terminate.');
});