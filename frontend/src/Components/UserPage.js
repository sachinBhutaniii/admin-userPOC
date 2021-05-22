import axios from "axios";
import React, { useEffect, useState } from "react";
import cookie from "react-cookies";

import { Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const UserPage = () => {
  const [tokenVal, setTokenVal] = useState("");
  const [Flag, setFlag] = useState(false);

  const [details, setDetails] = useState({
    _id: "",
    name: "",
    email: "",
    password: "",
    role: "",
    category: "",
  });

  //change password
  const [chnagePWD, setChangePWD] = useState(false); //handle inputs
  const [currPWD, setCurrPWD] = useState({
    oldPass: "",
    newPass: "",
    confirmPass: "",
  }); //handle value

  useEffect(() => {
    // console.log("token value :  ", tokenVal);
    const tok = cookie.load("auth-token");
    setTokenVal(tok);

    tokenVal &&
      axios
        .get(
          `http://localhost:8080/api/extractid`,
          tokenVal && {
            headers: {
              "auth-token": tokenVal, //the token is a variable which holds the token
            },
          }
        )
        .then((result) => {
          console.log("Extracted data is ", result);

          setDetails({
            ...details,
            _id: result.data._id,
            name: result.data.name,
            password: result.data.password,
            email: result.data.email,
            role: result.data.role,
            category: result.data.category,
          });
        })
        .catch((err) => console.log(err));
  }, [tokenVal]);

  /*
  useEffect(() => {
    //extracting name from category id
    details &&
      axios
        .get(`http://localhost:8080/api/category/${details.category}`)
        .then(result => {
          console.log("Category ", result);
          setDetails({ ...details, category: result.data.name });
        });
  }, [details]);
*/

  const checkPasword = () => {
    //check password from backend
    setChangePWD(!chnagePWD);
    console.log("Current Password is ", currPWD);

    //verify from backend
    currPWD &&
      axios
        .put(
          `http://localhost:8080/api/user/verifypassword/${details._id}`,
          currPWD
        )
        .then((result) => {
          // console.log("Data from verify password api is ", result);
          if (result.status == 200) alert("Password Successfully Changed");
        })
        .catch((err) => {
          console.log(err);
          alert(err.response.data);
        });
  };

  const editDetails = () => {
    setFlag(true);
  };

  const updateDetails = () => {
    setFlag(false);
    const id = details._id;
    axios
      .put(`http://localhost:8080/api/user/${id}`, details)
      .then((res) => {
        console.log("RESPONSE of put request: ", res);
        console.log("RESPONSE", res.status);
        alert("Successfully Updated");
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  };

  return (
    <div>
      <h1>Welcome to User dashboard</h1>
      {/* <h2>{details.name}</h2>
      <h2>{details.email}</h2>
      <h2>{details._id}</h2>
      <h2>{details.password}</h2> */}
      <div className="box">
        <Card
          border="dark"
          style={{
            width: "40rem",
            // marginLeft: "450px",
            marginBottom: "15px",
            backgroundColor: "#DEDBDB",
          }}
        >
          <Card.Body>
            <p>Role is : {details.role == 0 ? "User" : "Admin"}</p>
            <p>Category is : {details.category.name}</p>

            <p>Name is : {details.name}</p>
            {Flag ? (
              <input
                type="text"
                placeholder={details.name}
                value={details.name}
                onChange={(e) =>
                  setDetails({ ...details, name: e.target.value })
                }
              />
            ) : null}

            <p>Email is : {details.email}</p>
            {Flag ? (
              <input
                type="text"
                placeholder={details.email}
                value={details.email}
                onChange={(e) =>
                  setDetails({ ...details, email: e.target.value })
                }
              />
            ) : null}

            {Flag ? (
              <div>
                <br></br>
                <Button variant="dark" onClick={() => setChangePWD(!chnagePWD)}>
                  Change Password
                </Button>{" "}
              </div>
            ) : null}

            {chnagePWD ? (
              <div>
                {" "}
                <br></br>
                <input
                  type="text"
                  placeholder="Please Enter Current Password"
                  value={currPWD.oldPass}
                  onChange={(e) =>
                    setCurrPWD({ ...currPWD, oldPass: e.target.value })
                  }
                />{" "}
                <br></br>
                <br></br>
                <input
                  type="text"
                  placeholder="Please Enter New  Password"
                  value={currPWD.newPass}
                  onChange={(e) =>
                    setCurrPWD({ ...currPWD, newPass: e.target.value })
                  }
                />{" "}
                <input
                  type="text"
                  placeholder="Please Confirm New  Password"
                  value={currPWD.confirmPass}
                  onChange={(e) =>
                    setCurrPWD({ ...currPWD, confirmPass: e.target.value })
                  }
                />{" "}
                <br></br>
                <Button variant="secondary" onClick={() => checkPasword()}>
                  Done
                </Button>
              </div>
            ) : null}

            <p>ID is : {details._id}</p>
            {/* <p>Password is : {details.password}</p> */}

            <Button
              variant="warning"
              style={{ marginBottom: "4px" }}
              onClick={editDetails}
            >
              Edit Details
            </Button>
            <br></br>
            {Flag ? (
              <Button variant="secondary" onClick={updateDetails}>
                Done
              </Button>
            ) : null}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default UserPage;
