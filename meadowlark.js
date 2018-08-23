var express = require('express');
var fortune = require('./lib/fortune.js');

var app = express();

app.set('port',process.env.PORT || 3000);

//创建handlebars视图引擎
var handlebars = require('express3-handlebars')
	.create({defaultLayout: 'main'});
app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');

app.use(express.static(__dirname + '/public'));

app.get('/',function(req,res){
	// res.type('text/plain');
	// res.send('Meadowlark Travel');
	res.render('home');
});
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