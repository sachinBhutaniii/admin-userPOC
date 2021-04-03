import axios from "axios";
import React, { useEffect, useState } from "react";
import cookie from "react-cookies";
import { Redirect } from "react-router-dom";
import AdminPage from "./AdminPage";
import UserPage from "./UserPage";
const Check = () => {
  const [flag, setFlag] = useState("");
  const [tokenVal, setTokenVal] = useState("");
  const [invalid, setInavlid] = useState();

  //   const token = cookie.load("auth-token");

  useEffect(() => {
    const tok = cookie.load("auth-token");
    setTokenVal(tok);
    axios
      .get(
        "http://localhost:8080/api/authorize",
        tokenVal && {
          headers: {
            "auth-token": tokenVal, //the token is a variable which holds the token
          },
        }
      )
      .then(res => {
        console.log("Response recived is", res.data);
        setFlag(res.data);
      })
      .catch(err => {
        //        setInavlid(err.response.data);
        console.log(err);
      });
  });

  useEffect(() => {
    console.log("Value of flag changed yo ", flag);
  }, [tokenVal]);

  return (
    <div>
      {flag == "1" ? (
        // <Redirect to="/adminpage" />
        <AdminPage />
      ) : flag == "0" ? (
        // <Redirect to="/userpage" />
        <UserPage />
      ) : invalid && flag ? (
        <h1>Access Denied</h1>
      ) : (
        <div>
          <h1>Loading....</h1>
          {/*add loading gif here */}
        </div>
      )}
    </div>
  );
};

export default Check;
