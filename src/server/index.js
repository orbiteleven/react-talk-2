/* eslint no-console: 0 */

import bodyParser from 'body-parser';
import express from 'express';
import MongoClient from 'mongodb';
import path from 'path';
import omit from 'lodash.omit';

import applyMiddleware from './middleware';

const port = 3000;
const app = express();

const jsonParser = bodyParser.json();

MongoClient.connect('mongodb://0.0.0.0:27017/todos', (mongoErr, db) => {
  if (mongoErr) {
    return console.log(mongoErr);
  }

  const collection = db.collection('todos');

  applyMiddleware(app);

  function fetchAllTodos(res) {
    collection.find({}).toArray((err, results) => {
      if (err) res.sendStatus(500).send(err);
      res.send(results);
    });
  }

  app.post('/api/todos', jsonParser, (req, res) => {
    const todo = req.body;
    collection.insert(todo, (err, doc) => {
      if (err) res.sendStatus(500).send(err);
      const inserted = doc.ops[0];
      inserted.id = inserted._id;
      res.send(inserted);
    });
  });

  app.get('/api/todos', (req, res) => {
    return fetchAllTodos(res);
  });

  app.put('/api/todos/:id', jsonParser, (req, res) => {
    const todo = req.body;

    collection
      .updateOne({id: todo.id}, {$set: omit(todo, '_id')})
      .then(() => {
        collection.findOne({id: todo.id})
          .then(doc => {
            return res.send(doc);
          });
      })
      .catch(err => {
        return res.sendStatus(500).send(err);
      });
  });

  app.post('/api/todos/markAllComplete', jsonParser, (req, res) => {
    const completed = req.body.completed;

    collection.updateMany({}, {$set: {completed: completed}})
      .then(() => {
        return fetchAllTodos(res);
      });
  });

  app.get('*', (req, res) => {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '..', '..', 'dist/index.html')));
    res.end();
  });

  app.listen(port, '0.0.0.0', (err) => {
    if (err) {
      console.log(err);
    }
    console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
  });
});
