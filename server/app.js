const createError = require('http-errors');
const express = require('express');
const fs = require('fs')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const body = require('body-parser');
const task = require('./modules/tasks');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('public/sqlite/time.db');

var indexRouter = require('./routes/index');
const { info } = require('console');
var app = express();

task.run();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(logger('dev'));
app.use(body.urlencoded({ extended: true }));
app.use(body.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.get('/Chart/:id', function (req, res) {
  console.log(req.params.id);
});

app.post('/', function (req, res) {
  task.updateConfig(req.body.path)
  res.send("Tutto ok");
});

app.post('/App', function (req, res) {
  console.log(req.body);
  let sql = `SELECT *, min(tempo) as tempo FROM Tabella GROUP BY nome,cognome ORDER BY tempo ASC`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    let info = task.getInfoValue();
    let server = info[0];
    let track = info[1];
    res.send({rows , server, track});
  });
});


app.get('/Activation', function (req, res) {
  let file = JSON.parse(fs.readFileSync('activation.json'));
  (file.key == 200 ? res.send("Activated") : res.send("Not activated"));
});

// Controllo chiave (Da implementare con un futuro DB)
app.post('/Activation', function (req, res) {
  if (req.body.key === "070812") {
    res.send(true);
    task.createPermission();
  } else {
    res.send(false);
  }
});

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
