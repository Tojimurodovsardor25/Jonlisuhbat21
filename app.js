var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { engine } = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const suhbatRouter = require('./routes/suhbat')

const virables = require('./middleware/virables')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.engine('hbs', engine({
  layoutsDir: path.join(__dirname, 'views/layouts'),
  defaultLayout: 'layout',
  extname: 'hbs',
  partialsDir: [path.join(__dirname, 'views/partials')],
  runtimeOptions: {
    allowProtoMethodsByDefault: true,
    allowProtoPropertiesByDefault: true
  }
}))

const store = new MongoStore({
  uri: 'mongodb+srv://sardortojimuradov:v9t73Ua43co5b4pi@cluster0.hhgwy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  collection: 'session'
})

require('./helper/db')()

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  resave: false,
  secret: 'some_secret_key',
  saveUninitialized: false,
  store
}))

app.use('/admin', express.static(path.join(__dirname, 'public')))
app.use('/admin:any', express.static(path.join(__dirname, 'public')))

app.use(virables)

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/suhbat', suhbatRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
