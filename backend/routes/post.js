const router = require("express").Router();
const User = require("../model/User");
const verify = require("./verifyToken");

router.get("/", verify, async (req, res) => {
  // res.json({ posts: { title: "Barca", description: "Random data.... " } });

  // after using the verifyToken middleware we set a req.user so we can access it here also , eg to get the user etc
  const loggedin_user = await User.findOne({ _id: req.user._id });
  console.log(loggedin_user.role);

  if (loggedin_user.role === 1) res.send("1");
  else if (loggedin_user.role === 0) res.send("0");
  else res.status(400).send("Bad Request");
});

module.exports = router;
