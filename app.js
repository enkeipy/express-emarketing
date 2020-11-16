//jshint esversion:6

// loads environment variables API_USERNAME and API_KEY from a .env file //
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('signup');
});

app.post('/', (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const https = require('https');
  const data = {
    members: [{
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const API_KEY = process.env.API_KEY;
  const AUDIENCE_ID = process.env.AUDIENCE_ID;
  const jsonData = JSON.stringify(data);
  const url = 'https://' + API_KEY.slice(-3) + '.api.mailchimp.com/3.0/lists/' + AUDIENCE_ID;
  const options = {
    method: "POST",
    auth: 'anystring:' + API_KEY
  };

  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.render('success');
    } else {
      res.render('failure');
    }
    response.on('data', (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post('/failure', (req, res) => {
  res.redirect('/');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running');
});
