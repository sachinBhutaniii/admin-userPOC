// for authentication routes
// const express = require("express");

// const app = express();
const router = require("express").Router();
const User = require("../model/User");
const Blog = require("../model/Blog");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verify = require("./verifyToken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

//send grid
const sgMail = require("@sendgrid/mail");

const crypto = require("crypto");
// //for cookies
// var cookieParser = require("cookie-parser");
// app.use(cookieParser());
dotenv.config();

//express validator
const { check, validationResult } = require("express-validator");

sgMail.setApiKey(`SG.${process.env.APIKEY}`);

// // if person logged in is a user
// router.get("/", verify, async (req, res) => {
//   const loggedin_user = await User.findOne({ _id: req.user._id });
//   console.log(loggedin_user.role);

//   if (loggedin_user.role === 0) res.send("Welcome to User Dashboard");
//   else res.status(400).send("Access Denied , Please login as a USER");
// });

//get a blogs of a single user
router.get("/getMyBlogs/:id", async (req, res) => {
  console.log("Id Recieved is ", req.params.id);

  Blog.find({ author: req.params.id })
    .populate("author")
    .then((result) => res.send(result))
    .catch((err) => console.log(err));
});

//delete a blogs of a single user
router.delete("/deleteBlog/:id", async (req, res) => {
  console.log("Id Recieved for delete is ", req.params.id);

  Blog.deleteOne({ _id: req.params.id })
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
});

//get all users
router.get("/all", verify, async (req, res) => {
  //only admin can access this api
  const role = await User.findById({ _id: req.user._id });
  console.log(role.role);

  if (!role.role == 1) return res.status(400).send("You are not an ADMIN");

  //ne -> where role is not equal to 1
  User.find({ role: { $ne: 1 } })
    .populate("category")
    .then((result) => res.send(result))
    .catch((err) => console.log(err));
});

//view all blogs
router.get("/allBlogs", async (req, res) => {
  Blog.find()
    .populate("author")
    .then((result) => res.send(result))
    .catch((err) => console.log(err));
});

//adding a blog
router.post("/postblogs", verify, async (req, res) => {
  const blogTitle = req.body.blogTitle;
  const blogDescription = req.body.blogDescription;
  const file = req.body.file ? req.body.file : "";

  // console.log("Blog post body", blogTitle, blogDescription);

  if (!blogTitle || blogTitle.length < 5) {
    res.send("Blog Title is required and length should be more than 5");
  } else if (!blogDescription || blogDescription.length < 10) {
    res.send("Blog Description is required and length should be more than 10");
  } else {
    const user = await User.findById({ _id: req.user._id });
    // console.log("POST BLOG API", user.name);
    // res.send(user);

    const blog = new Blog({
      name: blogTitle,
      description: blogDescription,
      file: file,
      author: user._id,
    });

    // console.log("Blog created is", blog);
    blog
      .save()
      .then((result) => res.send(result))
      .catch((err) => res.status(404).send(err));
  }
});

//updating old password
router.put("/resetPassword", async (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;

  console.log("Reset Password called");

  User.findOne({
    resetToken: sentToken,
    expireToken: { $gt: Date.now() },
  }).then((user) => {
    if (!user) return res.status(422).send("Try Again Session Expired");

    bcrypt.hash(newPassword, 10).then((hashPassword) => {
      user.password = hashPassword;
      user.resetToken = undefined;
      user.expireToken = undefined;

      user
        .save()
        .then((savedUser) => {
          res.send("Password Successfully updated");
        })
        .catch((err) => console.log(err));
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
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
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
      file: req.body.file,
    });
    user
      .save()
      .then((result) => res.send(result))
      .catch((err) => res.status(404).send(err));
  }
);

//get a single user
// router.get("/:id", (req, res) => {
//   User.findById(req.params.id)
//     .populate("category")
//     .then((result) => res.send(result))
//     .catch((err) => res.status(400).send(err));
// });

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
      res.status(400).send("Passwords Do Not Match");

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
      .then((result) => res.send(result))
      .catch((err) => res.send(err));
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
            file: req.body.file,
          },
        }
      )
        .then((result) => res.send(result))
        .catch((err) => res.send(err));
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
        .then((result) => res.send(result))
        .catch((err) => res.send(err));
    } else {
      res.status(400).send("email already exists");
    }
  }
);

// forget passowrd

/*
router.post("/forgetpassword", (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }

    const token = buffer.toString("hex");

    if (req.body.email === "") {
      res.status(400).send("Email Required");
    }

    User.findOne({ email: req.body.email }).then((result) => {
      if (result === null) {
        res.status(403).send("Email Not In DB");
      } else {
        //result store the entire user object
        // console.log("RESULTS OF FORGOT", result)

        result.resetToken = token;
        result.expireToken = Date.now() + 3600000; //expires after 1 hour ie usercant reset pass after 1 hout
        result.save().then((result) => {
          //
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
             <a href="http://localhost:3000/resetpassword${token}">Forgot Password</a>`,
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
*/

//using send grid
router.post("/forgetpassword", (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }

    const token = buffer.toString("hex");

    if (req.body.email === "") {
      res.status(400).send("Email Required");
    }

    User.findOne({ email: req.body.email }).then((result) => {
      if (result === null) {
        res.status(403).send("Email Not In DB");
      } else {
        //result store the entire user object
        // console.log("RESULTS OF FORGOT", result)

        result.resetToken = token;
        result.expireToken = Date.now() + 3600000; //expires after 1 hour ie usercant reset pass after 1 hout
        result.save().then((result) => {
          //sending mail

          const msg = {
            to: `${req.body.email}`,
            from: "bhutani.sachin1019@gmail.com",
            subject:
              "Looks Like you dont remember your password , No worries we have got you covered",
            // text: "Helloooooooooooooooooooooooo",
            html: ` <h1>Click On The Link Below To Reset Your Password </h1>
             <a href="http://localhost:3000/resetpassword${token}">Forgot Password</a>`,
          };

          sgMail.send(msg, function (err, info) {
            if (err) {
              console.log("Errorin sending Mail", err);
              res.status(400).send(err);
            } else {
              console.log("Mail sent ");
              res.status(200).send("Mail Send");
            }
          });
        });
      }
    });
  });
});

module.exports = router;
