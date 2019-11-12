const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      return callback(err);
    }
    fs.writeFile(exports.dataDir + `/${id}.txt`, text, err => {
      if (err) {
        return callback(err);
      }
      callback(null, { id, text });
    });
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      return callback(err);
    }

    var data = files.map(file => {
      var id = file.slice(0, file.length - 4);
      return { id, text: id };
    });
    callback(null, data);
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(exports.dataDir + `/${id}.txt`, (err, data) => {
    if (err) {
      return callback(err);
    }
    var text = data.toString();
    callback(null, { id, text });
  });
};

exports.update = (id, text, callback) => {
  exports.readOne(id, err => {
    if (err) {
      return callback(err);
    }
    fs.writeFile(exports.dataDir + `/${id}.txt`, text, err => {
      if (err) {
        return callback(err);
      }
      callback(null, { id, text });
    });
  });
};

exports.delete = (id, callback) => {
  fs.unlink(exports.dataDir + `/${id}.txt`, err => {
    if (err) {
      return callback(err);
    }
    callback();
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
