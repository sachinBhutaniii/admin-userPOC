import React, { useEffect, useState } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

const SignUp = () => {
  const [redirect, setRedirect] = useState();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    category: "",
  });

  const [category, setCategory] = useState();
  // const [selectedCategory , setSelectedCategory] = useState();

  useEffect(() => {
    console.log("Something changed ", data);
  }, [data]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/category/all")
      .then(res => {
        console.log("Categories RECEIVED: ", res.data);
        setCategory(res.data);
      })
      .catch(err => {
        console.log("AXIOS ERROR: ", err.response.data);
      });
  }, []);

  const sendRequest = e => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/api/user/register", data)
      .then(res => {
        console.log("RESPONSE RECEIVED: ", res);
        console.log("RESPONSE", res.status);
        // alert("Signed Up successfully ");
        if (res.status == 200) {
          setRedirect(true);
        }
      })
      .catch(err => {
        // console.log("AXIOS ERROR: ", err.response.data);
        alert(err);
      });

    //redirecting
  };

  const handleDropdown = e => {
    console.log("Selected value", e.target.value);
    // setSelectedCategory(e.target.value);
    setData({ ...data, category: e.target.value });
  };

  return (
    <div>
      <h1>Sign Up Page</h1>

      <div className="drop-div">
        <label for="matches">Choose a category:</label>
        <div>
          <select className="category" onChange={e => handleDropdown(e)}>
            {category &&
              category.map(i => <option value={i._id}>{i.name}</option>)}
          </select>
        </div>
      </div>
      <br></br>

      <div className="form-div">
        <form onSubmit={sendRequest}>
          Name :
          <br />
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={e => setData({ ...data, name: e.target.value })}
          />
          <br />
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
          <button type="submit">SignUp</button>
          <br />
        </form>
        {redirect ? <Redirect to="/login" /> : null}
      </div>
    </div>
  );
};

export default SignUp;
