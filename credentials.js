module.exports = {
	cookieSecret: 'your cookie secret goods here',
	gmail: {
		user: 'your gmail username',
		pass: 'your gmail password'
	},
	mongo: {
		development: {
			connectionString: 'mongodb://<dbuser>:<dbpassword>@ds243212.mlab.com:43212/meadowlark',
		},
		production: {
			connectionString: 'mongodb://<dbuser>:<dbpassword>@ds243212.mlab.com:43212/meadowlark',
		}
	}
}