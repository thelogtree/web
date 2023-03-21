var express = require("express");
var app = express();
var cors = require("cors");
var path = require("path");
app.use(cors());

app.use(express.static(path.join(__dirname, "build"))); // hosts frontend files

app.get("/*", function (req, res) {
  // redirecting server to frontend index.html where react router can handle routing
  res.sendFile(path.join(__dirname, "build/index.html"), function (error) {
    if (error) {
      res.status(500).send(error);
    }
  });
});

app.listen(process.env.PORT || 9000);
