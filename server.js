const express = require("express");
const app = express();
const bodyParse = require("body-parser");
const mongoose = require("mongoose");
const Bear = require("./app/models/bear");

mongoose.connect("mongodb://localhost/test_app", { useNewUrlParser: true });

app.use(bodyParse.urlencoded({ extended: true }));
app.use(bodyParse.json());

const port = process.env.PORT || 3000;
const router = express.Router();

router.use(function(req, res, next) {
  console.log("Something is happening.");
  next();
});

router.get("/", function(req, res) {
  res.json({ message: "hooray! welcome to our api!" });
});

router.route("/bears").post(function(req, res) {
  const bear = new Bear();
  bear.name = req.body.name;
  bear.save(function(err) {
    if (err) res.send(err);
    res.json({ message: "Bear created!" });
  });
});

router.route("/bears").get(function(req, res) {
  Bear.find(function(err, bears) {
    if (err) res.send(err);
    res.json(bears);
  });
});

router.route("/bears/:bear_id").get(function(req, res) {
  Bear.findById(req.params.bear_id, function(err, bear) {
    if (err) res.send(err);
    res.json(bear);
  });
});

router.route("/bears/:bear_id").put(function(req, res) {
  Bear.findById(req.params.bear_id, function(err, bear) {
    bear.name = req.body.name;
    bear.save(function(err) {
      if (err) res.send(err);
      res.json({ message: "Bear updated!" });
    });
  });
});

router.route("/bears/:bear_id").delete(function(req, res) {
  Bear.remove(
    {
      _id: req.params.bear_id
    },
    function(err) {
      if (err) res.send(err);
      res.json({ message: "Successfully deleted" });
    }
  );
});

app.use("/api", router);
app.listen(port);
console.log("Magic happens on port " + port);
