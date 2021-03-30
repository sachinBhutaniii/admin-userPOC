const router = require("express").Router();
const verify = require("./verifyToken");
const User = require("../model/User");

router.get("/", verify, async (req, res) => {
  const loggedin_user = await User.findOne({ _id: req.user._id });
  console.log(loggedin_user.role);

  if (loggedin_user.role === 1) res.send("Welcome to admin Dashboard");
  else res.status(400).send("Access Denied , you are not an ADMIN");
});

module.exports = router;
