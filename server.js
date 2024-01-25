const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();
const PORT = 3000;
// apikey
// 27ae6076e76e42480130b1a4010bea2c-us22
// listId
// 86ecf80b5f

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us22.api.mailchimp.com/3.0/lists/86ecf80b5f";
  const auth = {
    user: "bluebee",
    pass: "27ae6076e76e42480130b1a4010bea2c-us22",
  };
  const options = {
    method: "POST",
    auth: "" + auth.user + ":" + auth.pass,
  };

  const response = https.request(url, options, (response) => {
    console.log(response.statusCode);
    if (response.statusCode == 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", (data) => {
      // res.sendFile(__dirname + '/success.html')
    });
  });
  response.write(jsonData);
  response.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
