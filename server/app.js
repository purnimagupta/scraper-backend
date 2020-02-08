var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var Queue = require('bull');
var searchRouter = require('./src/routes/search');



var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

let workQueue = new Queue('work', REDIS_URL);

app.post('/api', async (req, res) => {
  let job = await workQueue.add();
  res.json({ id: job.id });
});


app.use(cors())
app.use('/api', searchRouter);



if(process.env.NODE_ENV === 'production') {
  //Static pages
  app.use(express.static(path.join(__dirname, 'public')));
  
  //handle routes for front end
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'))
}

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log(`App is listening on port ${PORT}`)
})
module.exports = app;
