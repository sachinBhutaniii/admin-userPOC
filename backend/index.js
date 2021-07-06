const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
//importing routes
const authRoute = require("./routes/auth");
const checkRoute = require("./routes/post");
const adminRoute = require("./routes/admin");
const extractid = require("./routes/extractId");
const category = require("./routes/category");

const cors = require("cors");
//express validator
//const { check, validationResult } = require("express-validator");
dotenv.config();

app.use(express.json({ limit: "5mb", extended: true }));
var cookieParser = require("cookie-parser");
const { db } = require("./model/Category");
app.use(cookieParser());
app.use(cors());

//connnect to DB

mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => {
    //db.Category.insertMany([{name:"Teacher"},{name:"Actor"},{name:"Doctor"},{name:"Painter"},{name:"Lawer"},{name:"Scientist"}])

    // result.Category.insertOne({name:"Abcdef"})
    console.log("Connected to DB");

    //if categories is empty insert these
    //connection is a promise
    const DB = mongoose.connection;

    DB.collection("categories")
      .countDocuments()
      .then((result) => {
        if (result == 0) {
          DB.collection("categories").insertMany([
            { name: "Teacher" },
            { name: "Actor" },
            { name: "Doctor" },
            { name: "Painter" },
            { name: "Lawer" },
            { name: "Scientist" },
          ]);
        }

        // DB.collection("users").createIndex({ name: "text" }); //creating index for searching
      });

    //inserting admin if doesnt exist
    // DB.collection('users').find({"role": 1})
    // .then(result = console.log(result))
    // .catch(err => console.log(err))
  })
  .catch((err) => console.log(err));

//Middleware
// app.use(express.json());
// app.use(bodyParser.json());
//route middlewares
app.use("/api/user", authRoute);
app.use("/api/authorize", checkRoute);
app.use("/api/admin", adminRoute);
app.use("/api/extractid", extractid);
app.use("/api/category", category);

app.listen(8080, () => console.log("Server running at 8080..."));
