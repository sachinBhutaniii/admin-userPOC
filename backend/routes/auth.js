// for authentication routes
// const express = require("express");

// const app = express();
const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verify = require("./verifyToken");

// //for cookies
// var cookieParser = require("cookie-parser");
// app.use(cookieParser());

//express validator
const { check, validationResult } = require("express-validator");

// // if person logged in is a user
// router.get("/", verify, async (req, res) => {
//   const loggedin_user = await User.findOne({ _id: req.user._id });
//   console.log(loggedin_user.role);

//   if (loggedin_user.role === 0) res.send("Welcome to User Dashboard");
//   else res.status(400).send("Access Denied , Please login as a USER");
// });

//get all users
router.get("/all", verify, async (req, res) => {
  //only admin can access this api
  const role = await User.findById({ _id: req.user._id });
  console.log(role.role);

  if (!role.role == 1) return res.status(400).send("You are not an ADMIN");

  User.find()
    .populate("category")
    .then(result => res.send(result))
    .catch(err => console.log(err));
});

router.post(
  "/login",
  [
    check("email", "Inavlid Email")
      .not()
      .notEmpty()
      .isLength({ min: 6, max: 255 })
      .isEmail(),
    check("password", "Inavlid Password")
      .not()
      .isEmpty()
      .isLength({ min: 6, max: 1024 }),
  ],
  async (req, res) => {
    const errors1 = validationResult(req);
    //   res.send("User Registered  ");
    if (!errors1.isEmpty()) {
      return res.status(422).json({
        errors: errors1.array()[0].msg,
      });
    }
    // //checking if user already exists or not
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Email Doesnt Exists");

    if (user.status == 0) return res.status(400).send("User Inactive");

    //if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send("Invalid Password");

    //res.send("Logged in Successfully");

    //Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    //adding token to the header

    res.cookie("auth-token", token, { expire: 360000 + Date.now() });
    res.header("auth-token", token).send(token);
  }
);

//delete
router.delete("/:id", (req, res) => {
  User.remove({ _id: req.params.id })
    .then(result => res.send(result))
    .catch(err => res.send(err));
});

router.post(
  "/register",
  [
    check("name", "Username is not valid")
      .not()
      .isEmpty()
      .withMessage("Name cannot be empty")
      .isLength({ min: 6, max: 255 })
      //.withMessage("Name should be of atleast 6 characters")
      .isAlpha(),
    //.withMessage("Name cannot have special character or number"),
    check("email", "Email is not valid")
      .not()
      .notEmpty()
      .isLength({ min: 6, max: 255 })
      .isEmail(),
    // .withMessage("Please enter correct email format"),
    check("password", "Password is not valid")
      .not()
      .isEmpty()
      .withMessage("Password cannot be empty")
      .isLength({ min: 6, max: 1024 }),
    //.withMessage("Password should be of atleast 6 characters"),
    check("role", "Enter a valid role").isLength({ max: 1, min: 0 }),
    check("category", "Select a category").not(),
  ],
  async (req, res) => {
    console.log("register called", req.body);
    const errors = validationResult(req);
    //   res.send("User Registered  ");
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()[0].msg,
      });
    }

    //checking if user already exists or not
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send("Email Already Exists");

    //hashing the password
    //10 is the complixity of the generated string
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //Creating a new user
    //const user = new User(req.body); this also works

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
      role: req.body.role,
      category: req.body.category,
    });
    user
      .save()
      .then(result => res.send(result))
      .catch(err => res.status(404).send(err));
  }
);

//get a single user
router.get("/:id", (req, res) => {
  User.findById(req.params.id)
    .then(result => res.send(result))
    .catch(err => res.status(400).send(err));
});

//update
router.put(
  "/:id",
  [
    check("name", "Username is not valid")
      .not()
      .isEmpty()
      .withMessage("Name cannot be empty")
      .isLength({ min: 6, max: 255 })
      //.withMessage("Name should be of atleast 6 characters")
      .isAlpha(),
    //.withMessage("Name cannot have special character or number"),
    check("email", "Email is not valid")
      .not()
      .notEmpty()
      .isLength({ min: 6, max: 255 })
      .isEmail(),
    // .withMessage("Please enter correct email format"),
  ],
  async (req, res) => {
    const errors3 = validationResult(req);
    //   res.send("User Registered  ");
    if (!errors3.isEmpty()) {
      return res.status(422).json({
        errors: errors3.array()[0].msg,
      });
    }

    //checking if user already exists or not

    const emailExists = await User.findOne({ email: req.body.email });
    // if (emailExist) return res.status(400).send("Email Already Exists");

    if (emailExists && req.params.id == emailExists._id) {
      return User.updateOne(
        { _id: req.params.id },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            category: req.body.category,
            status: req.body.status,
          },
        }
      )
        .then(result => res.send(result))
        .catch(err => res.send(err));
    } else if (!emailExists) {
      User.updateOne(
        { _id: req.params.id },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            category: req.body.category,
            status: req.body.status,
          },
        }
      )
        .then(result => res.send(result))
        .catch(err => res.send(err));
    } else {
      res.status(400).send("email already exists");
    }
  }
);

module.exports = router;
