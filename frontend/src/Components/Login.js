import React, { useEffect, useState } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect, useHistory } from "react-router-dom";

const Login = ({ flag, setFlag }) => {
  const [redirect, setRedirect] = useState();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  let history = useHistory();

  const sendRequest = e => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/api/user/login", data)
      .then(res => {
        cookie.save("auth-token", res.data);
        // console.log("RESPONSE RECEIVED: ", res);
        // console.log("RESPONSE", res.status);
        if (res.status == 200) {
          setFlag(true);
          setRedirect(true);
        }
      })
      .catch(err => {
        console.log("AXIOS ERROR: ", err);
        alert(err.response.data);
      });
  };

  const forgotPage = () => {
    history.push("/forgot");
    
  }

  return (
    <div>
      <h1>Login Page</h1>
      <div className="form-div">
        <form onSubmit={sendRequest}>
          Email :
          <br />
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={e => setData({ ...data, email: e.target.value })}
          />
          <br />
          Password :
          <br />
          <input
            type="text"
            name="password"
            value={data.password}
            onChange={e => setData({ ...data, password: e.target.value })}
          />
          <br />
          <br />
          <button type="submit">Login</button>
          <br />
        </form>
        <button onClick={()=>forgotPage()}  >Forgot Password</button>
        {redirect ? <Redirect to="/dashboard" /> : null}
      </div>
    </div>
  );
};

export default Login;
