var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var favicon = require('serve-favicon');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
require('./models/Macros');

mongoose.connect(process.env.KOKONATSUDB);

var app = express();

// set favicon
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.post('/github', function (req, res) {
    res.send('Received github payload');
    if(req.get("X-GitHub-Event") != "push"){
        return;
    }
    var payload = req.body;
    var repo = payload.repository.name;
    payload.commits.forEach(function(commit){
        var AuthHeaders = {"User-Agent" : "Kokonatsu (http://test.com, v0.1)", "Authorization" : "Bot "+process.env.BOTTOKEN};
        var author = commit.author.name;
        var msg = commit.message;
        var url = commit.url;
        var reply = "@everyone "+author+" has pushed a commit to "+repo+"\n`"+msg+"`\nview it here: "+url;
        require('request').post({"url": "https://discordapp.com/api/channels/"+process.env.DEVCHANNELID+"/messages", "headers": AuthHeaders, json: {content: reply}});
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;