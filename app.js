const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const multiparty = require("multiparty");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

// instantiate an express app
const app = express();
// cors
app.use(cors({ origin: "*" }));

app.use("/public", express.static(process.cwd() + "/public")); //make public static

let transporter = nodemailer.createTransport({
  host: "smtp.live.com",
  secure: false,
  port: 587,
  logger: true,
  debug: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: true,
    ciphers: 'SSLv3'
  }
});

// verify connection configuration
transporter.verify(function (error, success) {
  if (success) {
    console.log("verification success");
  } else {
    console.log("error", error);
  }
  // console.log("transporter is running,", error);
  // if (error) {
  //   console.log(error);
  // } else {
  //   console.log("Server is ready to take our messages");
  // }
});

app.post("/api/send", (req, res) => {
  let form = new multiparty.Form();
  let data = {};
  form.parse(req, function (err, fields) {
    console.log(fields);
    Object.keys(fields).forEach(function (property) {
      data[property] = fields[property].toString();
    });
    console.log(data);
    const mail = {
      from: process.env.EMAIL,
      to: "ivan.sillasnavarro@gmail.com", // receiver email,
      subject: `${data.subject}`,
      text: `${data.name} <${data.email}> \n${data.message}`,
    };
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send("Something went wrong.");
      } else {
        res.status(200).send("Email successfully sent to recipient!");
      }
    });
  });
});

//Index page (static HTML)
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/public/index.html");
});

/*************************************************/
// Express server listening...
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});