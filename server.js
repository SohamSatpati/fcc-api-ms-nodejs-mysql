//initialize connection string
const UrlShortener = require('./src/model/urlshortener.model');
const {
  NewUserModel,
  NewExcerciseModel,
} = require('./src/model/excercisetracker.model');

const express = require('express');

const dns = require('dns');
const urlpareser = require('url');
const app = express();
//body-parser depricated so try with the following
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//port setup
let port = process.env.PORT || 5000;

//routing
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/view/index.html');
});

//routing for urlShortener project
app.get('/urlShortener', function (req, res) {
  res.sendFile(__dirname + '/view/urlShortener.html');
});

//routing for excerciseTracker project
app.get('/excerciseTracker', function (req, res) {
  res.sendFile(__dirname + '/view/excerciseTracker.html');
});

////////////////////////// URL SHORTENER START /////////////////////////////////////////////

//post request-urlshortener
app.post('/api/shorturl', function (req, res) {
  let isEmailAlreadyExist = false;
  const inputUrl = req.body.url;

  //check if the url is valid or not
  const something = dns.lookup(
    urlpareser.parse(inputUrl).hostname,
    (err, address) => {
      if (!address) {
        return false;
      } else {
        return true;
      }
    }
  );

  let isCorrectHostname = something.hostname;

  //check if url is already present in the database
  if (isCorrectHostname == undefined) {
    res.json({
      error: 'invalid url',
    });
  } else {
    UrlShortener.findByUrl(inputUrl, (err, findbyUrldata) => {
      if (err) res.send(err);
      else {
        if (findbyUrldata.length > 0) {
          isEmailAlreadyExist = true;
        } else {
          isEmailAlreadyExist = false;
        }
      }
      if (isEmailAlreadyExist === false) {
        UrlShortener.create(inputUrl, (err, createdata) => {
          if (err)
            res.send({ status: false, message: 'Error While inserting' });
          else {
            UrlShortener.findById(createdata, (err, findByIdData) => {
              if (err) res.send({ message: 'id could not found' });
              else {
                res.send({
                  original_url: findByIdData[0].original_url,
                  short_url: findByIdData[0].id,
                });
              }
            });
          }
        });
      } else {
        res.send({ message: 'url already exist' });
      }
    });
  }
});

//get request urlshortener
app.get('/api/shorturl/:id', function (req, res) {
  //check if the url-shoetid present in the database
  UrlShortener.findById(req.params.id, (err, findByIdData) => {
    if (findByIdData.length > 0) {
      if (err) res.send({ error: err });
      else {
        res.redirect(findByIdData[0].original_url);
      }
    } else {
      res.send({ message: 'id could not found' });
    }
  });
});

//get all urls
app.get('/api/shorturl', function (req, res) {
  UrlShortener.findAll((err, findAllData) => {
    if (err) res.send({ error: err });
    else {
      res.send({
        log: findAllData,
      });
    }
  });
});
//////////////////////// URL SHORTENER END /////////////////////////////////////////////////

/////////////////////// EXCERCISE TRACKER START ////////////////////////////////////////////

//check if name is alphanumeric or not
function isValidUsername(username) {
  let regex = /^[a-zA-Z0-9]{2,30}$/;
  return regex.test(username);
}

//add user api
app.post('/api/users', function (req, res) {
  let inputUsername = req.body.username;
  let isUsernameExist = false;
  inputUsername = inputUsername.toLowerCase().trim();
  //check valid username
  const isValid = isValidUsername(inputUsername);
  if (isValid === true) {
    //check username already present in the database

    NewUserModel.findByName(inputUsername, (err, findByNameData) => {
      if (err) res.send({ error: err });
      else {
        if (findByNameData.length > 0) {
          isUsernameExist = true;
        } else {
          isUsernameExist = false;
        }
      }
      if (isUsernameExist === false) {
        NewUserModel.createNewUser(inputUsername, (err, createNewUserData) => {
          if (err) res.send({ error: err });
          else {
            NewUserModel.findByID(createNewUserData, (err, findByIdData) => {
              if (err) res.send({ error: err });
              else {
                res.send({
                  username: findByIdData[0].username,
                  id: findByIdData[0].id,
                });
              }
            });
          }
        });
      } else {
        res.send({
          message: 'username already taken',
        });
      }
    });
  } else {
    res.send({
      message: 'invalid username! ,username should be in alphanumeric',
    });
  }
});

//get all users data api
app.get('/api/users', (req, res) => {
  NewUserModel.findAll((err, findAllData) => {
    if (err) res.send({ error: err });
    else {
      res.send({
        users: findAllData,
      });
    }
  });
});

//add excercise to the database api
app.post('/api/users/:_id/exercises', function (req, res) {
  let isIdPresent = false;
  //present the object which would be inserted in the database
  let newExcerciseObj = {
    userId: req.params._id,
    duration: req.body.duration,
    description: req.body.description,
    regdate: req.body.date,
  };
  // console.log(newExcerciseObj);

  const newExcerciseData = new NewExcerciseModel(newExcerciseObj);
  //check if _id is present in database or not
  NewUserModel.findByID(req.params._id, (err, findByIdData) => {
    if (err) res.send({ error: err });
    else {
      if (findByIdData.length > 0) {
        isIdPresent = true;
      } else {
        isIdPresent = false;
      }
    }
    //create new excercise
    if (isIdPresent === true) {
      NewExcerciseModel.createNewExcercise(
        newExcerciseData,
        (err, insertedData) => {
          if (err) res.send({ error: err });
          else {
            NewExcerciseModel.findUsernameAndId(
              insertedData,
              (err, findIdandUnameData) => {
                if (err) res.send({ error: err });
                else {
                  res.send({
                    id: findIdandUnameData[0].id,
                    username: findIdandUnameData[0].username,
                    description: findIdandUnameData[0].description,
                    duration: findIdandUnameData[0].duration,
                    date: findIdandUnameData[0].regdate.toDateString(),
                  });
                }
              }
            );
          }
        }
      );
    } else {
      res.send({
        error: 'User id not found!',
      });
    }
  });
});

//get all users excercises and their name and id

app.get('/api/users/:_id/logs', function (req, res) {
  let userlogs = [];
  let isIdPresent = false,
    isUserIdPresent = false;
  const { from, to, limit } = req.query;
  const userId = req.params._id;

  //check if id is present in the database
  NewUserModel.findByID(userId, (err, findByIdData) => {
    if (err) res.send({ error: err });
    else {
      if (findByIdData.length > 0) {
        isIdPresent = true;
      } else {
        isIdPresent = false;
      }
    }
    //check if the userId present in the database
    //for both id in user and userid in excercise table have to present, then only you get value

    NewExcerciseModel.findByUserId(userId, (err, findByUserIdData) => {
      if (err) res.send({ error: err });
      else {
        if (findByUserIdData.length > 0) {
          isUserIdPresent = true;
        } else {
          isUserIdPresent = false;
        }
      }

      if (isIdPresent === true && isUserIdPresent === true) {
        NewExcerciseModel.findUserDetails(userId, (err, findAllData) => {
          if (err) res.send({ error: err });
          else {
            //set the limit
            if (limit) {
              findAllData = findAllData.slice(0, +limit);
            }

            //set date from where logs will genarate
            if (from) {
              const fromDate = new Date(from);
              findAllData = findAllData.filter(
                (exe) => new Date(exe.regdate) >= fromDate
              );
            }

            //set date from where logs will genarate
            if (to) {
              const toDate = new Date(to);
              findAllData = findAllData.filter(
                (exe) => new Date(exe.regdate) <= toDate
              );
            }

            findAllData.map((log) => {
              userlogs.push({
                description: log.description,
                duration: log.duration,
                date: log.regdate.toDateString(),
              });
            });
            console.log(userlogs);
            res.send({
              id: findAllData[0].id,
              username: findAllData[0].username,
              count: userlogs.length,
              logs: userlogs,
            });
          }
        });
      } else {
        res.send({
          error: 'User id not found!',
        });
      }
    });
  });
});

/////////////////////// EXCERCISE TRACKER END ////////////////////////////////////////////
// listen for requests :)
const listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
