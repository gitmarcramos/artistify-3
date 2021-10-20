const express = require("express");
const router = express.Router();
const fileUploader = require("../config/cloudinary");
const userModel = require("../model/user");
const bcrypt = require("bcrypt");


// GET route signup
router.get("/signup", (req, res) => {
  res.render("auth/signup.hbs");
});

// POST route signup
router.post("/signup", fileUploader.single("avatar"), async (req, res) => {
  try {
    const newUser = { ...req.body };
    const foundUser = await userModel.findOne({ email: newUser.email });

    if (foundUser) {
      req.flash(
        "warning",
        "Wesh gros, t'existe déjà te fous pas de moi c'est pas la fête !"
      );
      res.redirect("/auth/signup");
    } else {
      const hashedPassword = bcrypt.hashSync(newUser.password, 10);
      newUser.password = hashedPassword;
      await userModel.create(newUser);
      req.flash("succes", "Wesh gros, welcome to the Candy Shop");
      res.redirect("/auth/signin");
    }
  } catch (e) {
    req.flash("error", "Wesh signup gros");
    res.redirect("/auth/signup");
  }
});

// GET route Signin
router.get("/signin", (req, res, next) => {
  res.render("auth/signin.hbs");
});

// POST route signin
router.post("/signin", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const foundUser = await userModel.findOne({ email: email });

    console.log(password, email, req.body.email, foundUser);

    if (!foundUser) {
      req.flash(
        "error",
        "Gros, on sait ce qui va pas mais peut-être que tu viens hacker Internet alors vas manger le sang de tes morts on va pas te donner plus d'infos"
      );
      res.redirect("/auth/signin");
    } else {
      const isAGoodPassword = bcrypt.compareSync(password, foundUser.password);
      if (!isAGoodPassword) {
        req.flash(
          "error",
          "Gros, on sait ce qui va pas mais peut-être que tu viens hacker Internet alors vas manger le sang de tes morts on va pas te donner plus d'infos"
        );
        res.redirect("/auth/signin");
      } else {
        const userObject = foundUser.toObject();
        delete userObject.password;

        req.session.currentUser = userObject;
        req.flash("success", "Bienvenue chez les Chti's");
        res.redirect("/");
      }
    }
  } catch (e) {
    req.flash(
      "error",
      "Wesh gros arrête de promettre des trucs que tu peux pas tenir"
    );
  }
});

router.get("/signout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/signin");
  });
});

module.exports = router;
