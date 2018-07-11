var express = require('express');
var mongoose = require('mongoose');
var bp = require('body-parser');
var app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/dogo_test_db', function(){
	console.log('Connected!')
});

app.use(bp.urlencoded({extended: true}));

var path = require('path');

app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

var zordSchema = new mongoose.Schema({
	name: String, 
	ranger: String,
	part: String,
	coolness: Number
})

const Zords = mongoose.model('Zord', zordSchema);

app.get('/', function(req, res){
	Zords.find({}, function(errs, data){
		if (errs) {
			console.log('Errors getting zords');
		}
		else{
			console.log('Got zords')
			var zords = data;
		}
		res.render('index', {zords: zords});

	})
})


app.get('/zords/new', function(req, res){
	res.render('new');
})

app.get('/zords/:id', function(req, res){
	var id = req.params.id;
	Zords.findById(id, function(errs, data){
		if (errs){
			console.log('Could not find zord');
		} else {
			console.log('Got a zord');
			console.log(data);
		}
		res.render('zord', {zord: data});
	})
})

app.post('/zords', function(req, res){
	Zords.create(req.body, function(errs, data){
		if (errs){
			console.log(errs);
		} else {
			console.log(data);
		}
		res.redirect('/');
	})
})

app.get('/zords/edit/:id', function(req, res){
	id = req.params.id;
	Zords.findById(id, function(errs, data){
		if (errs){
			console.log('Could not find zord');
		} else {
			console.log('Got a zord');
			console.log(data);
		}
		res.render('edit', {zord: data});
	})
})

app.post('/zords/:id', function(req, res){
	var id = req.params.id;
	Zords.findByIdAndUpdate(id, {
		name: req.body.name,
		ranger: req.body.ranger,
		part: req.body.part,
		coolness: req.body.coolness
	}, function(errs, zord){
		if (errs){
			console.log('Error updating');
		} else {
			console.log('Updated Zord')
		}
		res.redirect('/');
	})
}) 

app.post('/zords/delete/:id', function(req, res){
	var id = req.params.id;
	Zords.findByIdAndDelete(id, function(errs, data){
		if (errs){
			console.log('error deleting');
		} else {
			console.log('successfully deleted')
		}
		res.redirect('/');
	})
})

app.listen(8000, function(){
	console.log('Listening');
});