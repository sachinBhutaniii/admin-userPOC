import axios from "axios";
import React, { useEffect, useState } from "react";

import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState();

  useEffect(() => {
    console.log("value of email is", email);
  }, [email]);

  const mailAPIcall = () => {
    if (!email || email.length < 5) {
      alert("Enter correct email address");
      return;
    }

    email &&
      axios
        .post("http://localhost:8080/api/user/forgetpassword", { email: email })
        .then((res) => {
          console.log("forgoooooooooootttttttttttttttttttttt", res);
          if (res.status == 200) alert("Mail Sent , Please Check your email");
        })
        .catch((err) => {
          console.log(err);
          alert(err);
        });
  };

  return (
    <div>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter Your email here"
      />
      <Button
        variant="warning"
        style={{ marginLeft: "4px" }}
        onClick={mailAPIcall}
      >
        Send Mail
      </Button>
    </div>
  );
};

export default ForgotPasswordPage;
