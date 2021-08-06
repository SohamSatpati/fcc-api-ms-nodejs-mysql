const mysql = require('mysql');

const dbConn = require('../../dbconnection/dbconn');
//Create UrlShortener object

const UrlShortener = function (newUrl) {
  this.original_url = newUrl.original_url;
};

//insert a new url in the database table
UrlShortener.create = function (inputurl, result) {
  const sql =
    'INSERT INTO `urlshortener`(`original_url`) VALUES (' +
    mysql.escape(inputurl) +
    ')';

  dbConn.query(sql, function (err, res) {
    if (err) {
      console.log('error: ', err);
      result(null, err);
    } else {
      // console.log('inserted id:=', res.insertId);
      result(null, res.insertId);
    }
  });
};
//fetch given url is present in the database or not

UrlShortener.findByUrl = function (givenurl, result) {
  console.log('given url=' + givenurl);
  dbConn.query(
    'SELECT original_url FROM urlshortener WHERE original_url = ' +
      mysql.escape(givenurl),
    function (err, res) {
      if (err) {
        console.log('error: ', err);
        result(null, err);
      } else {
        //console.log('found url:=', res);
        result(null, res);
      }
    }
  );
};

UrlShortener.findById = function (id, result) {
  console.log('id passed', id);
  dbConn.query(
    'SELECT * FROM `urlshortener` WHERE id=?',
    [id],
    function (err, res) {
      if (err) {
        console.log('error: ', err);

        result(null, err);
      } else {
        result(null, res);
      }
    }
  );
};

UrlShortener.findAll = function (result) {
  dbConn.query('SELECT * FROM `urlshortener`', function (err, res) {
    if (err) {
      console.log('error', err);
      result(null, res);
    } else {
      //console.log('all data', res);
      result(null, res);
    }
  });
};
module.exports = UrlShortener;
