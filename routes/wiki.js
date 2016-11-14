const express = require('express');
const router = express.Router();


router.get('/', function(req,res,next){
    // res.render('index');
    res.redirect('/');
});

router.post('/', function(req, res, next){
	res.json(req.body);
});

router.get('/add/', function (req, res, next){
	res.render('addpage');
});



module.exports = router;