var express = require('express');
var connect = require('connect');  //原先捆绑的中间件，其中包括一些基本的以及一些以及废弃的中间件
var fortune = require('./lib/fortune.js');
var weatherData = require('./lib/weatherData.js');
var credentials = require('./credentials.js');
var session = require('express-session');
var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var Vacation = require('./models/vacation.js');

var app = express();

app.set('port',process.env.PORT || 3000);

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

//引入Cookie与内存存储
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(session({
	secret: 'cookieSecret',//作为服务器端生成session的签名
 	resave: true,          //(是否允许)当客户端并行发送多个请求时，其中一个请求在另一个请求结束时对session进行修改覆盖并保存。
 	saveUninitialized:true //初始化session时是否保存到存储。
}));
app.use(function(req,res,next){
// 	//如果有即显消息，把它传到上下文中，然后清除它
	res.locals.flash = req.session.flash;
	delete req.session.flash;
	next();
})

app.use(express.static(__dirname + '/public'));
app.use(require('body-parser')());  //post解析URL编码

app.use(function(req,res,next){
	if(!res.locals.partials) res.locals.partials = {};
	res.locals.partials.weather = weatherData.getWeatherData();
	next();
})

//创建一个Nodemailer实例
// var mailTransport = nodemailer.createTransport('SMTP',{
// 	service: 'Gmail',
// 	auth: {
// 		user: credentials.gmail.user,
// 		pass: credentials.gmail.password
// 	}
// })

//简单的发送邮件
// mailTransport.sendMail({
// 	from: '"Meadowlark Travel" <info@meadowlarktrvel.com>',
// 	to: 'joecustomer@gmail.com, "Jane Customer" <jane@yahoo.com>,' + 'fred@hotmail.com',  //支持发送多个用户，中间用逗号隔开
// 	subject: 'Your Meadowlark Travel Tour',
// 	text: 'Thank you for booking your trip with Meadowlark Travel.' + 'We look forward to your visit!',
// },function(err){
// 	if(err) console.error('Unable to send email: ' + error);
// })

//数据库处理部分
var opts = {
	server: {
		socketOptions: { keepAlive: 1}
	}
};

//创建度假包的数据
Vacation.find(function(err,vacations){
	if(vacations.length) return;

	new Vacation({
		name: 'Hood River Fay Trip',
		slug: 'Hood-river-day-trip',
		category: 'Day Trip',
		sku: 'HR199',
		description: 'Spend a day sailing on the Columbia and ' + 'enjoying craft beers in Hood River',
		priceInCents: 9995,
		tags: ['day trip','hood river','sailing','windsurfing','breweries'],
		inSeason: true,
		maximumGuests: 16,
		available: true,
		packagesSold: 0,
	}).save();
	new Vacation({
		name: 'Oregon Coast Getaway',
		slug: 'oregon-coast-getaway',
		category: 'Weekend Getaway',
		sku: 'OC39',
		description: 'Enjoy the ocean air and quaint coastal towns!', 
		priceInCents: 269995,
		tags: ['weekend getaway', 'oregon coast', 'beachcombing'], 
		inSeason: false,
		maximumGuests: 8,
		available: true,
        packagesSold: 0,
    }).save();
    new Vacation({
		name: 'Rock Climbing in Bend',
		slug: 'rock-climbing-in-bend',
		category: 'Adventure',
		sku: 'B99',
		description: 'Experience the thrill of climbing in the high desert.', 
		priceInCents: 289995,
		tags: ['weekend getaway', 'bend', 'high desert', 'rock climbing'], 
		inSeason: true,
		requiresWaiver: true,
		maximumGuests: 4,
		available: false,
		packagesSold: 0,
		notes: 'The tour guide is currently recovering from a skiing accident.',
    }).save();
})

switch (app.get('env')) {
	case 'development':
		mongoose.connect(credentials.mongo.development.connectionString,opts);
		break;
	case 'production':
		mongoose.connect(credentials.mongo.production.connectionString,opts);
		break;
	default:
		throw new Error('Unknown execution enviroment: ' + app.get('env'));
}

//普通表单处理
app.get('/',function(req,res){
	// res.type('text/plain');
	// res.send('Meadowlark Travel');
	res.render('home');
});
app.get('/jquerytest',function(req,res){
	// res.type('text/plain');
	// res.send('Meadowlark Travel');
	res.render('jquerytest');
});
app.get('/nursery-rhyme',function(req,res){
	res.render('nursery-rhyme');
})
//AJAX返回数据
app.get('/data/nursery-rhyme',function(req,res){
	res.json({
		animal: 'squirrel',
		bodyPart: 'tail',
		adjective: 'bushy',
		noun: 'heck',
	})
})
app.get('/newsletter',function(req,res){
	res.render('newsletter',{csrf: 'CSRF token goes here'});
})
app.get('/newsletter-ajax',function(req,res){
	res.render('newsletter-ajax',{csrf: 'CSRF token goes here'});
})
app.get('/thank-you',function(req,res){
	res.render('thank-you');
})
//普通的请求处理
app.post('/process',function(req,res){
	console.log('Form (from querystring): ' + req.query.from);
	console.log('CSRF token (from hidden from field): ' + req.body._csrf);
	console.log('Name (from visible from field): ' + req.body.name);
	console.log('Email (from visible from field): ' + req.body.email);
	res.redirect(303,'/thank-you');
})
//AJAX请求处理
app.post('/processajax',function(req,res){
	if(req.xhr || req.accepts('json,html') === 'json'){
		//如果发生错误，应该发送{error: 'error description'}
		res.send({success: true});
	}else{
		//如果发生错误，应该重定向到错误页面
		res.redirect(303,'/thank-you');
	}
})

//文件上传处理
app.get('/contest/vacation-photo',function(req,res){
	var now = new Date();
	res.render('contest/vacation-photo',{
		year: now.getFullYear(),month: now.getMonth()
	});
});
app.post('/contest/vacation-photo/:year/:month',function(req,res){
	var form = new formidable.IncomingForm();
	form.parse(req,function(err,fields,files){
		if(err) return res.redirect(303,'/error');
		console.log('received fields');
		console.log(fields);
		console.log('received files');
		console.log(files);
		res.redirect(303,'/thank-you');
	})
})

//数据库配套页面
app.get('/vacations',function(req,res){
	Vacation.find({available: true},function(err,vacations){
		var context = {
			vacations: vacations.map(function(vacation){
				return{
					sku: vacation.sku,
					name: vacation.name,
					description: vacation.description,
					price: vacation.price(),
					inSeason: vacation.inSeason,
				}
			})
		};
	res.render('vacations');
	})
})

app.get('/about',function(req,res){
	// res.type('text/plain');
	// res.send('About Meadowlark Travel');
	res.render('about',{fortune: fortune.getFortune()});
})

//定制404页面
app.use(function(req,res){
	// res.type('text/plain');
	// res.status(404);
	// res.send('404 - Not Found');
	res.status(404);
	res.render('404');
});

//定制500页面
app.use(function(err,req,res,next){
	console.log('err.stack');
	// res.type('text/plain');
	res.status(500);
	res.send('500');
});

app.listen(app.get('port'),function(){
	console.log('Express started on http://localhost:' +
		app.get('port') + '; press Ctrl-c to terminate.');
});