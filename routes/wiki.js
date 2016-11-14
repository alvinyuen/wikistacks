const express = require('express');
const router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;
var db = models.db;

router.get('/', function(req,res,next){
    // res.render('index');
    res.redirect('/');
});




router.post('/', function(req, res, next){
	var page = Page.build({
		title: req.body.title,
		content: req.body.content,
		status: req.body.status
	});

	//actually saving to the database
	page.save()
		.then(function(){
			res.redirect('/');
		});
});




router.get('/add/', function (req, res, next){
	res.render('addpage');
});

router.get('/:title', function(req, res, next){
	Page.findOne({
		where:{
			urlTitle: req.params.title.toLowerCase()
		}
	})
		.then(function(pageInstance){
			res.render(pageInstance)
		})
		.catch(next);

})

module.exports = router;