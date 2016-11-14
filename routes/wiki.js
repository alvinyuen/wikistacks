const express = require('express');
const router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;
var db = models.db;


router.get('/', function(req, res, next) {
	// res.render('index');
	Page.findAll({})
		.then(function(pagesInstance) {
			res.render('index', {
				pages: pagesInstance
			});
		});
	// res.redirect('/');
});


router.post('/', function(req, res, next) {

	User.findOrCreate({
			where: {
				name: req.body.authorname,
				email: req.body.authoremail
			}
		})

		.then(function(values) {
			console.log(values);
			console.log('after user created!');
			var user = values[0];

			var page = Page.build({
				title: req.body.title,
				content: req.body.content,
				status: req.body.status
			});

			return page.save().then(function(page) {
				console.log('setting author');
				return page.setAuthor(user);
			});

		})
		.then(function(page) {
			res.redirect('/wiki/'+page.urlTitle);
		})
		.catch(next);
});



router.get('/add/', function(req, res, next) {
	res.render('addpage');
});





router.get('/users', function(req, res, next){
	User.findAll({})
	.then(function(usersInstance){
		res.render('users', { users: usersInstance});
	});
	next();
});


router.get('/:title', function(req, res, next) {
	Page.findOne({
			where: {
				urlTitle: req.params.title.toLowerCase()
			}
		})
		.then(function(pageInstance) {
			res.render('wikipage', {
				title: pageInstance.title,
				content: pageInstance.content
			});
			
		});

});

router.get('/user/:id', function(req, res, next){
	console.log('finding user id');
	User.findOne({
		where: {
			id: req.params.id
		}
	})
	.then(function(values){
		console.log('found one user!');
		var user = values;
		console.log('USER',user);

		return Page.findAll({
			where: {
				authorId: user.id
			}
		});
	})
	.then(function(pages){
		console.log('found all user pages');
		console.log('pages', pages);
		res.render('user', {pages:pages});
	});

});










module.exports = router;