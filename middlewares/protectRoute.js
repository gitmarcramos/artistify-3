function protectRoute(req, res, next) {
  console.log("==========>");
  console.log(req.session.currentUser);

  if (req.session.currentUser) next();
  else res.redirect("/auth/signin");
}

module.exports = protectRoute;
