const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
mongoose.connect('mongodb://localhost:27017/todo', {useNewUrlParser: true});
	
let TodoSchema=new Schema({
	username:String,
	title:String,
	task_complete:Boolean,
	category:String
},{ timestamps: true });

// mongoose.model('Todo',Todo)
const Todo = mongoose.model('Todo', TodoSchema);


app.post('/createtodo',(req,res)=>{


let newtodo =new Todo({
		username:req.body.username,
		title:req.body.title,
		category:req.body.category
		}).save((err,todo)=>{
			if(err){
				return res.send(err)
			}
			res.send(todo)})
})

app.get('/getall',async(req,res)=>{
	let temp= await Todo.find({})
	res.send(temp);
})

app.get('/getbyuser',async(req,res)=>{
	let temp=await Todo.find({username:req.body.username})
	res.send(temp);
})

app.get('/update',async(req,res)=>{
	let temp=await Todo.update({_id:req.body.id},req.body);
	res.send(temp);
})

app.get('/remove',async(req,res)=>{

	let temp= await Todo.remove({_id:req.body.id})
	res.send(temp);
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
