//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
//const req = require('request');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/', (req,res) => {
  res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req,res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const https = require('https');

  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  const url = 'https://us2.api.mailchimp.com/3.0/lists/1769416370';
  const options = {
    method: "POST",
    auth: "enkeipy:6b0f47e1f5d28c4beb77c2dfcb855115-us2"
  };

  const request = https.request(url, options, (response) => {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + '/success.html');
    } else {
      res.sendFile(__dirname + '/failure.html');
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
