//import connection string for database
const mysql = require('mysql');
const dbConn = require('../../dbconnection/dbconn');

//create model for NewUserModel
const NewUserModel = function (NewUserModelname) {
  this.username = NewUserModelname.username;
};

//create model for excercise
const NewExcerciseModel = function (newexcercise) {
  this.userId = newexcercise.userId;
  this.duration = newexcercise.duration;
  this.description = newexcercise.description;
  this.regdate =
    newexcercise.regdate === null || newexcercise.regdate === ''
      ? new Date()
      : newexcercise.regdate;
};

//insert NewUserModelname in the database table

NewUserModel.createNewUser = function (NewUserModelname, result) {
  const sql =
    'INSERT INTO `user`(`username`) VALUES (' +
    mysql.escape(NewUserModelname) +
    ')';
  dbConn.query(sql, function (err, res) {
    if (err) {
      console.log('Error while insertion', err);
      result(null, res);
    } else {
      // console.log('Successfully Inserted new username');
      result(null, res.insertId);
    }
  });
};

//find an user with its name

NewUserModel.findByName = (givenUsername, result) => {
  dbConn.query(
    'SELECT username FROM user WHERE username=?',
    [givenUsername],
    (err, res) => {
      if (err) {
        console.log('Error while searching given username', err);
        result(null, res);
      } else {
        //console.log('Successfully found this given username');
        result(null, res);
      }
    }
  );
};

//find user by ID

NewUserModel.findByID = (insertedID, result) => {
  console.log('id passed:=', insertedID);
  dbConn.query('SELECT * FROM user WHERE id=?', [insertedID], (err, res) => {
    if (err) {
      console.log('Error while searching given username', err);
      result(null, res);
    } else {
      //console.log('Successfully fetched user details');
      result(null, res);
    }
  });
};

//get all users

NewUserModel.findAll = (result) => {
  dbConn.query('SELECT * FROM user ', (err, res) => {
    if (err) {
      console.log('Error while searching given username', err);
      result(null, res);
    } else {
      //console.log('Successfully fetched user details');
      result(null, res);
    }
  });
};

//create new excercise

NewExcerciseModel.createNewExcercise = (newexcercise, result) => {
  dbConn.query('INSERT INTO `excercises` SET ?', [newexcercise], (err, res) => {
    if (err) {
      console.log('Error while inserting new excercise', err);
      result(null, res);
    } else {
      console.log('Successfully inserted new excercise');
      result(null, res.insertId);
    }
  });
};

//find username and id with respect to userId
NewExcerciseModel.findByUserId = (passedId, result) => {
  console.log('id passed:=', passedId);
  dbConn.query(
    'SELECT * FROM excercises WHERE userId=?',
    [passedId],
    (err, res) => {
      if (err) {
        console.log('Error while searching given username', err);
        result(null, res);
      } else {
        //console.log('Successfully fetched user details');
        result(null, res);
      }
    }
  );
};
//find username and id of newly created excercise

NewExcerciseModel.findUsernameAndId = (insertId, result) => {
  const sql =
    'SELECT e.description,e.regdate,e.duration,u.id,u.username FROM `user` u, excercises e WHERE u.id = e.userId AND e.id = ?';
  dbConn.query(sql, [insertId], (err, res) => {
    if (err) {
      console.log('Could not found username and id');
      result(null, res);
    } else {
      console.log('Successfully found id and username');
      result(null, res);
    }
  });
};

NewExcerciseModel.findUserDetails = (passedId, result) => {
  console.log('id passed:=', passedId);
  const sql =
    'SELECT e.description,e.regdate,e.duration,u.id,u.username FROM `user` u, excercises e WHERE u.id = e.userId AND e.userId = ?';
  dbConn.query(sql, [passedId], (err, res) => {
    if (err) {
      console.log('Could not found username and id');
      result(null, res);
    } else {
      //console.log('Successfully found id and username', res);
      result(null, res);
    }
  });
};

module.exports = { NewUserModel, NewExcerciseModel };
