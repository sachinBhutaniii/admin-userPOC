const router = require("express").Router();
const verify = require("./verifyToken");
const User = require("../model/User");

router.get("/", verify, async (req, res) => {
  const loggedin_user = await User.findOne({ _id: req.user._id });
  console.log(loggedin_user.role);

  if (loggedin_user.role === 1) res.send("Welcome to admin Dashboard");
  else res.status(400).send("Access Denied , you are not an ADMIN");
});

router.post("/search", (req, res) => {
  //
  // const serachTerm = req.body.searchTerm;

  const serachTerm = req.body.name;
  // console.log("NAMEEEEE", serachTerm);

  User.find({
    $and: [
      { role: { $ne: 1 } },
      { name: { $regex: serachTerm, $options: "$i" } },
    ],
  })
    .populate("category")
    .then((result) => res.send(result));
});

module.exports = router;
