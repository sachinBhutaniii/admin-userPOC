//for protected routes
//this will be a middleware which we can use in protected routes

const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("auth-token");

  if (!token) return res.status(401).send("Access Denied");

  try {
    console.log("Request 1 ", req.user); //undefined
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified; // we are setting this value
    console.log("Request 2", req.user); //id of user and iat
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
  next();
};
