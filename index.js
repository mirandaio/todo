var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var User = require('./User');
var Todo = require('./Todo');
var appUtils = require('./utils');
var MONGO_URI = process.env.MONGO_URI || 'mongodb://admin:admin@ds013918.mlab.com:13918/todoapp';
var SECRET = process.env.SECRET || 'foobar';

mongoose.connect(MONGO_URI);

var app = express();

app.use(express.static('public'));
app.use(express.static('bower_components'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/dones', function(req, res) {
  console.log('GET /dones');
  var token = req.headers.authorization.slice(7);
  var user = jwt.verify(token, SECRET);
  Todo.find({userid: user._id, completed: true}).then(function(dones) {
    res.send(dones);
  });
});

app.get('/todos', function(req, res) {
  console.log('GET /todos');
  var token = req.headers.authorization.slice(7);
  var user = jwt.verify(token, SECRET);
  Todo.find({userid: user._id, completed: false}).then(function(todos) {
    res.send(todos);
  });
});

app.put('/todos/:id', function(req, res) {
  console.log('PUT /todos/:id');
  var token = req.headers.authorization.slice(7);
  var user = jwt.verify(token, SECRET);
  Todo.findByIdAndUpdate(req.params.id, { completed: req.body.completed },
    function(err, updatedTodo) {
      if(err) return console.log(err);
      res.send(updatedTodo);
  });
});

app.put('/dones/:id', function(req, res) {
  console.log('PUT /dones/:id');
  var token = req.headers.authorization.slice(7);
  var user = jwt.verify(token, SECRET);
  Todo.findByIdAndUpdate(req.params.id, { completed: req.body.completed },
    function(err, updatedTodo) {
      if(err) console.error(err);
      res.send(updatedTodo);
  });
});

app.post('/todos', function(req, res) {
  console.log('POST /todos');
  var token = req.headers.authorization.slice(7);
  var user = jwt.verify(token, SECRET);
  var todo = new Todo({
    content: req.body.content,
    userid: user._id,
    completed: false
  });
  todo.save(function(err, todo) {
    if(err) return console.error(err);
    res.send(todo);
  });
});

app.post('/signup', function(req, res) {
  console.log('POST /signup');
  var username = req.body.username;
  User.findOne({username: username}).then(function(doc) {
    if(doc !== null) {
      res.send('The username is not unique');
    } else {
      var user = new User({
        name: req.body.name,
        username: username,
        password: appUtils.encryptPassword(req.body.password)
      });
      user.save(function(err, user) {
        if(err) return console.error(err);
        var token = appUtils.buildToken(user._id);
        res.send({token: token});
      });
    }
  });
});

app.post('/signin', function(req, res) {
  console.log('POST /signin');
  var username = req.body.username;
  var plainTextPassword = req.body.password;

  User.findOne({username: username}).then(function(user) {
    if(!user) {
      res.status(401).send('No user with the given username');
    } else {
      if(!appUtils.comparePasswords(plainTextPassword, user.password)) {
        res.status(401).send('wrong password');
      } else {
        var token = appUtils.buildToken(user._id);
        res.json({token: token});
      }
    }
  });
});

app.listen(process.env.PORT || 8764);
