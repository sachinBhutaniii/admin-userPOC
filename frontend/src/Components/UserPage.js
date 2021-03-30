import axios from "axios";
import React, { useEffect, useState } from "react";
import cookie from "react-cookies";

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
        .then(result => {
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
        .catch(err => console.log(err));
  }, [tokenVal]);

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

  const editDetails = () => {
    setFlag(true);
  };

  const updateDetails = () => {
    setFlag(false);
    const id = details._id;
    axios
      .put(`http://localhost:8080/api/user/${id}`, details)
      .then(res => {
        console.log("RESPONSE of put request: ", res);
        console.log("RESPONSE", res.status);
        alert("Successfully Updated");
      })
      .catch(err => {
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

      <div>
        <p>Role is : {details.role == 0 ? "User" : "Admin"}</p>
        <p>Category is : {details.category}</p>

        <p>Name is : {details.name}</p>
        {Flag ? (
          <input
            type="text"
            placeholder={details.name}
            value={details.name}
            onChange={e => setDetails({ ...details, name: e.target.value })}
          />
        ) : null}

        <p>Email is : {details.email}</p>
        {Flag ? (
          <input
            type="text"
            placeholder={details.email}
            value={details.email}
            onChange={e => setDetails({ ...details, email: e.target.value })}
          />
        ) : null}

        <p>ID is : {details._id}</p>
        {/* <p>Password is : {details.password}</p> */}
      </div>
      <button onClick={editDetails}>Edit Details</button>
      <br></br>
      {Flag ? <button onClick={updateDetails}>Done</button> : null}
    </div>
  );
};

export default UserPage;
