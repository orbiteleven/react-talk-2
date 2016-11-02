/* eslint no-console: 0 */

const bodyParser = require('body-parser');
const express = require('express');
const MongoClient = require('mongodb');
const path = require('path');
const omit = require('lodash.omit');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.js');

const port = 3000;
const app = express();

const compiler = webpack(config);
const middleware = webpackMiddleware(compiler, {
  publicPath: config.output.publicPath,
  contentBase: 'src',
  stats: {
    colors: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false
  }
});

const jsonParser = bodyParser.json();

MongoClient.connect('mongodb://0.0.0.0:27017/todos', function onMongoDB(mongoErr, db) {
  if (mongoErr) {
    return console.log(mongoErr);
  }

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));

  const collection = db.collection('todos');

  function fetchAllTodos(res) {
    collection.find().toArray(function onFetch(err, results) {
      if (err) res.sendStatus(500).send(err);
      res.send(results);
    });
  }

  app.get('/api/todos', function handleTodoFetch(req, res) {
    return fetchAllTodos(res);
  });

  app.post('/api/todos', jsonParser, function handleAddTodo(req, res) {
    const todo = req.body;
    collection.insert(todo, function onInsert(err, doc) {
      if (err) res.sendStatus(500).send(err);
      const inserted = doc.ops[0];
      inserted.id = inserted._id;
      res.send(inserted);
    });
  });

  app.put('/api/todos/:id', jsonParser, function handleUpdateTodo(req, res) {
    const todo = req.body;

    collection
      .updateOne({id: todo.id}, {$set: omit(todo, '_id')})
      .then(function onUpdate() {
        collection.findOne({id: todo.id})
          .then(function onFind(doc) {
            return res.send(doc);
          });
      })
      .catch(function onError(err) {
        return res.sendStatus(500).send(err);
      });
  });

  app.post('/api/todos/markAllComplete', jsonParser, function handleSetAllComplete(req, res) {
    const completed = req.body.completed;

    collection.updateMany({}, {$set: {completed: completed}})
      .then(function onMarked() {
        return fetchAllTodos(res);
      });
  });

  app.get('*', function handleRoot(req, res) {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
    res.end();
  });

  app.listen(port, '0.0.0.0', function onStart(err) {
    if (err) {
      console.log(err);
    }
    console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
  });
});
