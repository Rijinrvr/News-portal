var express = require("express");
var router = express.Router();
var { User } = require("../models/user.js");
var { News } = require("../models/news.js");

//--Authentication---------------------------------------

const isUser = (req, res, next) => {
  if (req.session.username) {
    next();
  } else {
    res.redirect("/login");
  }
};

//--Home Page-----------------------------------------------

router.get("/", (req, res) => {
  News.find({}).then((newsitems) => {
    res.render("list", { newsitems: newsitems });
  });
});

//--Add-----------------------------------------------------

router.get("/add", isUser, (req, res) => {
  res.render("add");
});

router.post("/add", isUser, (req, res) => {
  let news = new News({
    username: req.body.username,
    title: req.body.title,
    content: req.body.content,
    imageurl: req.body.imageurl,
    vediourl: req.body.vediourl,
  });
  news
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

//--View News---------------------------------------------------

router.get("/view/:id", (req, res) => {
  let id = {
    _id: req.params.id,
  };

  News.findOne(id).then((newslist) => {
    res.render("view", { newslist: newslist });
  });
});

//--Edit---------------------------------------------------------

router.get("/edit/:id", isUser, (req, res) => {
  let id = {
    _id: req.params.id,
  };

  News.findById(id).then((newsedit) => {
    if (newsedit.username == req.session.username) {
      res.render("edit", { newsedit: newsedit });
    } else {
      res.send("Sorry you have no rights to edit this content");
    }
  });
});

router.post("/edit/:id", isUser, (req, res) => {
  let editnews = {
    title: req.body.title,
    content: req.body.content,
    imageurl: req.body.imageurl,
    vediourl: req.body.vediourl,
  };
  let query = {
    _id: req.params.id,
  };

  News.updateOne(query, editnews)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

//--Delete-------------------------------------------------------

router.get("/delete/:id", isUser, (req, res) => {
  let query = {
    _id: req.params.id,
  };
  News.findById(query).then((result) => {
    if (result.username == req.session.username) {
      News.deleteOne(query).then((doc) => {
        res.redirect("/");
      });
    } else {
      res.send("Sorry you have no rights to edit this content");
    }
  });


});

//--Login----------------------------------------------------

router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/login", (req, res) => {
  let query = {
    username: req.body.username,
    password: req.body.password,
  };
  User.findOne(query).then((login) => {
    if (login) {
      req.session.username = login.username;
      res.redirect("/");
    } else {
      res.redirect("/login");
    }
  });
});

//--Signin--------------------------------------------------

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", (req, res) => {
  let user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  User.findOne({ username: user.username })
    .then((existingUser) => {
      if (existingUser) {
        res.send("This username is already taken");
      } else {
        return user.save();
      }
    })
    .then(() => {
      res.redirect("/login");
    });
});

//--Logout--------------------------------------------------

router.get("/logout", (req, res) => {
  req.session.username = "";
  res.redirect("/login");
});

module.exports = router;
