const router = require("express").Router();
const User = require("../model/User");
const verify = require("./verifyToken");

router.get("/", verify, async (req, res) => {
  // after using the verifyToken middleware we set a req.user so we can access it here also , eg to get the user etc
  const ExtractedUser = await User.findOne({ _id: req.user._id }).populate(
    "category"
  );

  // console.log("ExtractedUser is : ", ExtractedUser);
  res.send(ExtractedUser);
});

module.exports = router;
