const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
app.use(bodyParser.json({ type: ["application/json", "application/csp-report"] }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

var refreshTokenList = [];
let user

const mongoose = require('mongoose');
// fill in the connection string
mongoose.connect('');

const db = mongoose.connection;
// Upon connection failure
db.on('error', console.error.bind(console, 'Connection error:'));
// Upon opening the database successfully
db.once('open', function () {
  console.log("Connection is open...");

  const UserSchema = mongoose.Schema(
    {
      usermail: {
        type: String,
        required: [true, "email address is required"],
        unique: true, // prevent duplicate email addresses
      },
      password: {
        type: String,
        required: [true, "Password is required"],
      },
      role: {
        type: String,
        default: 'user', // default role is user, set to admin if needed
      },
      priKey: {
        type: String,
        default: "1357924680",
      },
    },
    { collection: 'userdata' },
  )

  const User = mongoose.model("userSchema", UserSchema);

  // login endpoint
  app.post('/login', (req, res) => {
    try {
      User.findOne({ usermail: req.body.usermail, password: req.body.password }).then((data) => {
        if (data) {
          // generate an accessToken and a refreshToken
          const accessToken = jwt.sign({ userId: data._id, usermail: data.usermail, role: data.role }, data.priKey, { expiresIn: '3m' });
          const refreshToken = jwt.sign({ userId: data._id, usermail: data.usermail, role: data.role }, data.priKey);
          refreshTokenList.push(refreshToken);
          res.json({
            accessToken,
            refreshToken,
          });
        }
        else {
          res.status(401).json({ message: 'Usermail or password incorrect' });
        }
      })
    } catch (err) {
      console.log(err);
    }
  });

  // using refreshToken to generate new accessToken for keeping login status
  app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;

    //get username from refreshToken
    const payload = jwt.decode(refreshToken);

    if (!refreshToken) {
      // return unautorized status if there is no refreshToken
      return res.status(401).json({ message: 'Not anutorized.' });
    }

    if (!refreshTokenList.includes(refreshToken)) {
      // return forbidden status if the refreshToken is not in the array
      return res.status(403).json({ message: 'Not allow to access.' });;
    }

    User.findOne({ usermail: payload.usermail }).then((data) => {
      // verify the refreshToken
      jwt.verify(refreshToken, data.priKey, (err, user) => {
        if (err) {
          // check if the refreshToken is valid or not
          return res.status(403).json({ message: 'Not allow to access.' });
        }
      })
      // create a new accessToken and return it
      res.json({ accessToken: jwt.sign({ userId: data._id, usermail: data.usermail, role: data.role }, data.priKey, { expiresIn: '3m' }) });
    })
  });

  app.post('/logout', (req, res) => {
    // retrieve the refreshToken in the array
    refreshTokenList = refreshTokenList.filter((token) => token !== req.body.refreshToken);
    res.json({ message: 'Logout successfully.' });
  });

  // create a new account
  app.post('/register', (req, res) => {
    const { usermail, password } = req.body;
    const priKey = "1357924680";
    const role = 'user';
    const newUser = new User({ usermail, password, role, priKey });

    newUser.save()
      .then(() => {
        console.log("New account successfully created.");
        res.json({ message: 'New account creation succeed.' });
      })
      .catch((error) => {
        console.log("Failed to save new account");
        res.status(500).json({ error: 'Failed to create account' });
      });
  });
  
});

const server = app.listen(5001, () => {
  console.log("server running")
});
