import axios from "axios";
import React, { useState } from "react";
import { useHistory, useParams } from "react-router";

import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState();
  let history = useHistory();

  const updatePassword = () => {
    if (!password || password.length < 6)
      alert("Password should be of atleast 6 digits");

    token &&
      axios
        .put(`http://localhost:8080/api/user/resetPassword`, {
          token,
          password,
        })
        .then((res) => {
          console.log(res);
          alert(res.data);
          history.push("/");
        })
        .catch((err) => {
          console.log(err);
        });
  };

  return (
    <div>
      Enter new password here .
      <input
        type="text"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter new Password"
      />
      <button onClick={updatePassword}>Done</button>
    </div>
  );
};

export default ResetPassword;
