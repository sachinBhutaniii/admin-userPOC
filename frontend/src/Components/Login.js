import React, { useEffect, useState } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect, useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./custom.css";

const Login = ({ flag, setFlag }) => {
  const [redirect, setRedirect] = useState();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  let history = useHistory();

  const sendRequest = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/api/user/login", data)
      .then((res) => {
        cookie.save("auth-token", res.data);
        // console.log("RESPONSE RECEIVED: ", res);
        // console.log("RESPONSE", res.status);
        if (res.status == 200) {
          setFlag(true);
          setRedirect(true);
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
        alert(err.response.data);
      });
  };

  const forgotPage = () => {
    history.push("/forgot");
  };

  return (
    <div>
      <h1>Login Page</h1>
      <div className="form-div">
        <form onSubmit={sendRequest} className="loginForm">
          <label className="labl"> Email : </label>
          <br />
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <br />
          <label className="labl">Password :</label>
          <br />
          <input
            type="text"
            name="password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <br />

          {/* <button type="submit">Login</button> */}
          <Button
            style={{ padding: "8px", marginBottom: "4px" }}
            variant="info"
            type="submit"
            className="logbutton"
          >
            Login
          </Button>
          <br />
        </form>
        <Button
          variant="danger"
          className="forgotpass"
          onClick={() => forgotPage()}
        >
          Forgot Password
        </Button>
        {redirect ? <Redirect to="/dashboard" /> : null}
      </div>
    </div>
  );
};

export default Login;
