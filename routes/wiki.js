const express = require('express');
const router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;
var db = models.db;
const Promise = require('sequelize').Promise;

//index
router.get('/', function(req, res, next) {
	Page.findAll({})
		.then(function(pagesInstance) {
			res.render('index', {
				pages: pagesInstance
			});
		});
});

//submit form
router.post('/', function(req, res, next) {

	let tags = req.body.tags.split(' ');

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
				status: req.body.status,
				tags: tags
			});
			return page.save().then(function(page) {
				console.log('setting author');
				return page.setAuthor(user);
			});
		})
		.then(function(page) {
			res.redirect(page.route);
		})
		.catch(next);
});

//render submission form
router.get('/add/', function(req, res, next) {
	res.render('addpage');
});



//all users
router.get('/users', function(req, res, next) {
	User.findAll({})
		.then(function(usersInstance) {
			res.render('users', {
				users: usersInstance
			});
		});
});



//user page
router.get('/user/:id', function(req, res, next) {
	let userPromise = User.findOne({
		where: {
			id: req.params.id
		}
	});

	let pagePromise = Page.findAll({
		where: {
			authorId: req.params.id
		}
	});

	Promise.all([userPromise, pagePromise])
		.then(function(values) {
			let user = values[0];
			let pages = values[1];
			res.render('user', {
				pages: pages,
				user: user
			});
		});

});

//render search tag page
router.get('/search', function(req, res, next) {
	res.render('tags');
});


//search tag page
router.get('/searchTags', function(req, res, next) {
	let tagArr = req.query.tag.split(' ');
	console.log('tagArray', tagArr);
	Page.findByTag(tagArr)
		.then(function(pagesInstance) {
			res.render('index', {
				pages: pagesInstance
			});
		});
});


//content page
router.get('/:title', function(req, res, next) {

	Page.findOne({
			where: {
				urlTitle: req.params.title.toLowerCase()
			}
		})
		.then(function(pageInstance) {
			pageInstance.getAuthor()
				.then(function(user) {
					let userId = user.id;
					User.findOne({
							where: {
								id: userId
							}
						})
						.then(function(userInstance) {
							pageInstance.findBySimilar()
								.then(function(similarPages) {
									const tags = pageInstance.tags.join(' ');
									res.render('wikipage', {
										title: pageInstance.title,
										content: pageInstance.content,
										tags: tags,
										name: userInstance.name,
										email: userInstance.email,
										id: userInstance.id,
										similarPages: similarPages
									});

								});
						});
				});
		});
});

router.get('/:title/edit', function(req, res, next){
	// Page.update...
});

router.get('/:title/delete', function(req, res, next){
	//Page.destroy...
});


module.exports = router;