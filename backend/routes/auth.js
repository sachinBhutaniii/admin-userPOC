// for authentication routes
// const express = require("express");

// const app = express();
const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verify = require("./verifyToken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

const crypto = require("crypto");
// //for cookies
// var cookieParser = require("cookie-parser");
// app.use(cookieParser());
dotenv.config();

// require("dotenv/config");

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

//updating old password
router.put("/resetPassword", async (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;

  console.log("Reset Password called");

  User.findOne({
    resetToken: sentToken,
    expireToken: { $gt: Date.now() },
  }).then(user => {
    if (!user) return res.status(422).send("Try Again Session Expired");

    bcrypt.hash(newPassword, 10).then(hashPassword => {
      user.password = hashPassword;
      user.resetToken = undefined;
      user.expireToken = undefined;

      user
        .save()
        .then(savedUser => {
          res.send("Password Successfully updated");
        })
        .catch(err => console.log(err));
    });
  });
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
    .populate("category")
    .then(result => res.send(result))
    .catch(err => res.status(400).send(err));
});

//verify password
router.put(
  "/verifypassword/:id",
  [
    check("newPass", "Inavlid Password")
      .not()
      .isEmpty()
      .isLength({ min: 6, max: 1024 }),
    check("oldPass", "Inavlid Password")
      .not()
      .isEmpty()
      .isLength({ min: 6, max: 1024 }),
    check("confirmPass", "Inavlid Password")
      .not()
      .isEmpty()
      .isLength({ min: 6, max: 1024 }),
  ],
  async (req, res) => {
    console.log("Verify password called");

    //we get req.user from verify middleware
    // User.findById(req.params.id)
    //   .populate("category")
    //   .then(result => res.send(result))
    //   .catch(err => err.status(400).send(err));
    //get user info and check password with current password

    const userdetails = await User.findById(req.params.id);
    console.log(userdetails);

    const validPass = await bcrypt.compare(
      req.body.oldPass,
      userdetails.password
    );

    if (!validPass)
      return res.status(400).send("Please Enter Correct Current Password");

    //console.log(req.body.oldPass);
    console.log(req.body.newPass);
    console.log(req.body.confirmPass);

    //compare both new passwords
    if (req.body.newPass !== req.body.confirmPass)
      return res.status(400).send("Passwords Do Not Match");

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.newPass, salt);

    User.updateOne(
      { _id: req.params.id },
      {
        $set: {
          password: hashPassword,
        },
      }
    )
      .then(result => res.send(result))
      .catch(err => res.send(err));
  }
);

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

// forget passowrd
/*
router.post("/forgetpassword", (req, res) => {
  if (req.body.email === "") {
    res.status(400).send("Email Required");
  }

  User.findOne({ email: req.body.email }).then(result => {
    if (result === null) {
      res.status(403).send("Email Not In DB");
    } else {
      // res.send(result);
      //send mail

      //account sending the mail
      const transporter = nodemailer.createTransport({
        service: "smtp.ethereal.email",
        auth: {
          user: "cielo.torphy@ethereal.email",
          pass: `GaUFa8pFy3gwern98B`,
        },
      });

      const mailoptions = {
        from: "no-reply@nodemailer.com",
        to: `${req.body.email}`,
        subject: "link to reset",
        text:
          `Click on the link below to reset your password \n ` +
          `http://localhost:3000/resetpassword`,
        http: `<a href="http://localhost:3000/resetpassword" >Click Here</a>`,
      };

      transporter.sendMail(mailoptions, (err, response) => {
        if (err) {
          res.send("There was an error while sending mail");
        } else {
          console.log(response);
          res.status(200).send("Recovery Email sent ");
        }
      });

      //else close
    }
  });
});
*/

router.post("/forgetpassword", (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }

    const token = buffer.toString("hex");

    if (req.body.email === "") {
      res.status(400).send("Email Required");
    }

    User.findOne({ email: req.body.email }).then(result => {
      if (result === null) {
        res.status(403).send("Email Not In DB");
      } else {
        //result store the entire user object
        // console.log("RESULTS OF FORGOT", result)

        result.resetToken = token;
        result.expireToken = Date.now() + 3600000; //expires after 1 hour ie usercant reset pass after 1 hout
        result.save().then(result => {
          //
          console.log(process.env.EMAIL_ADDRESS);
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              //write email id and pass here
              user: process.env.EMAIL_ADDRESS,
              pass: process.env.PASSWORD,
            },
          });

          var mailOptions = {
            from: `admin@nodemail.com`,
            to: `${req.body.email}`,
            subject: "Sending Email using Node.js",
            html: ` <h1>Hello </h1>
             <a href="http://localhost:3000/resetpassword/${token}">Forgot Password</a>`,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
              res.send(error);
            } else {
              console.log("Email sent: " + info.response);
              res.send("Email sent");
            }
          });
        });
      }
    });
  });
});

module.exports = router;
