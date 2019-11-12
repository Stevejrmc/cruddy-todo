const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  new Promise((resolve, reject) => {
    fs.readFile(exports.counterFile, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  }).then(data => {
    callback(null, Number(data));
  }).catch(err => {
    callback(err, 0);
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  new Promise((resolve, reject) => {
    fs.writeFile(exports.counterFile, counterString, err => {
      if (err) {
        reject(err);
      }
      resolve(counterString);
    });
  }).then(data => {
    callback(null, data);
  }).catch(err => {
    callback(err);
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (cb) => {
  readCounter((err, data) => {
    if (err) {
      return cb(err);
    }
    data++;
    writeCounter(data, (err, data) => {
      if (err) {
        cb(err);
      }
      cb(null, data);
    });
  });
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
