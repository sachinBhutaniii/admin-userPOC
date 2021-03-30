import axios from "axios";
import React, { useEffect, useState } from "react";
import cookie from "react-cookies";

const AdminPage = () => {
  const [data, setData] = useState();
  const [tokenVal, setTokenVal] = useState("");

  const [editflag, setEditFlag] = useState();
  const [fieled, setField] = useState(); //do diplay input field on that index only

  const [demo, setDemo] = useState(false);
  //for adding user

  // const [user, setUser] = useState(false);

  //for new user
  const [addUser, setAddUser] = useState({
    name: "",
    email: "",
    password: "",
    category: "",
  });

  const [category, setCategory] = useState();

  const [userForm, setUserForm] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/category/all")
      .then(res => {
        console.log("Categories RECEIVED: ", res.data);
        setCategory(res.data);
      })
      .catch(err => {
        console.log("AXIOS ERROR: ", err);
      });
  }, []);

  const sendRequest = e => {
    e.preventDefault();
    // setUserForm(true);

    console.log("Form Submitting.....");

    axios
      .post("http://localhost:8080/api/user/register", addUser)
      .then(res => {
        console.log("RESPONSE RECEIVED:  after register", res);
        console.log("RESPONSE", res.status);
        alert("User added successfully successfully ");
        setUserForm(false);
        setAddUser({
          name: "",
          email: "",
          password: "",
          category: "",
        });
        // setData(res.data);
      })
      .catch(err => {
        // console.log("AXIOS ERROR: ", err.response.data);
        alert(err.message);
      });

    //redirecting
  };

  const handleDropdown = e => {
    console.log("Selected value", e.target.value);
    // setSelectedCategory(e.target.value);
    setAddUser({ ...addUser, category: e.target.value });
  };

  const showField = index => {
    setField(index);
    setEditFlag(1);
  };

  const hideField = index => {
    setField(index);
    setEditFlag(0);
    // setUser(!user);
    console.log("INSIDEEEEEEEEEEEE");
    axios
      .put(`http://localhost:8080/api/user/${data[index]._id}`, data[index])
      .then(res => {
        console.log("RESPONSE of put request: ", res);
        console.log("RESPONSE", res.status);
        alert("Successfullt added");
        setDemo(!demo);
      })
      .catch(err => {
        alert(err.response.data);
        setDemo(!demo);
      });
  };

  const nameHandler = (e, index) => {
    const new_data = [...data];
    new_data[index].name = e.target.value;

    setData(new_data);
  };

  const editCategory = (e, index) => {
    //console.log(e.target.value); //return id of category
    const new_data2 = [...data];
    console.log("NEW DATA !", new_data2);
    new_data2[index].category = e.target.value;
    setData(new_data2, () => console.log("NEW DATA !", new_data2));
  };

  const mailHandler = (e, index) => {
    const new_data1 = [...data];
    new_data1[index].email = e.target.value;

    setData(new_data1);
  };

  //get category from id
  const getCategory = id => {
    // console.log(id);
    const categ = category.filter(cat => cat._id == id);
    // console.log("Cat is ", categ);
    return categ[0].name; //filter returns an object
  };

  const deletedata = index => {
    // console.log(data[index]._id);

    axios
      .delete(`http://localhost:8080/api/user/${data[index]._id}`)
      .then(res => {
        // console.log("RESPONSE of put request: ", res);
        // setData(res.data);
        console.log("RESPONSE of delte", res);
        setDemo(!demo);
      })
      .catch(err => {
        console.log("AXIOS ERROR: ", err);
      });
  };

  useEffect(() => {
    //display all users
    const tok = cookie.load("auth-token");
    setTokenVal(tok);

    tokenVal &&
      axios
        .get(
          `http://localhost:8080/api/user/all`,
          tokenVal && {
            headers: {
              "auth-token": tokenVal, //the token is a variable which holds the token
            },
          }
        )
        .then(result => {
          // console.log("Extracted data is ", result);
          setData(result.data);
        })
        .catch(err => console.log(err));
  }, [tokenVal, userForm, demo /*, user*/]); // pass user state here for rerender

  useEffect(() => {
    //extracting name from category id
    data &&
      data.category &&
      axios
        .get(`http://localhost:8080/api/category/${data.category}`)
        .then(result => {
          console.log("Category ", result);
          setData({ ...data, category: result.data.name });
        });
  });

  const changeStatus = index => {
    //
    console.log("Account to be changed ", data[index]);

    if (data[index].status == 1) data[index].status = 0;
    else data[index].status = 1;

    axios
      .put(`http://localhost:8080/api/user/${data[index]._id}`, data[index])
      .then(res => {
        console.log("RESPONSE of put request: ", res);
        console.log("RESPONSE", res.status);
        setDemo(!demo);
      })
      .catch(err => {
        console.log("AXIOS ERROR: ", err);
        alert(err);
        setDemo(!demo);
      });
  };

  return (
    <div>
      <h1>Welcome to admin dashboard</h1>
      <button onClick={() => setUserForm(true)}>ADD USER</button>

      {userForm ? (
        <div>
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
                value={addUser.name}
                onChange={e => setAddUser({ ...addUser, name: e.target.value })}
              />
              <br />
              Email :
              <br />
              <input
                type="email"
                name="email"
                value={addUser.email}
                onChange={e =>
                  setAddUser({ ...addUser, email: e.target.value })
                }
              />
              <br />
              Password :
              <br />
              <input
                type="text"
                name="password"
                value={addUser.password}
                onChange={e =>
                  setAddUser({ ...addUser, password: e.target.value })
                }
              />
              <br />
              <br />
              <button type="submit">Done</button>
              <br />
            </form>
          </div>
        </div>
      ) : null}

      {data &&
        category &&
        data.map((i, index) => (
          <div>
            {i.role == 1 ? null : (
              <div>
                <h2>Name :</h2>
                <p>{i.name}</p>
                {editflag == 1 && fieled === index ? (
                  <input
                    type="text"
                    placeholder={data[index].name}
                    value={data[index].name}
                    onChange={e => nameHandler(e, index)}
                  />
                ) : null}
                <h2>Role:</h2>
                <p>User </p>
                <h2>Category :</h2>
                <p>{getCategory(i.category)}</p>
                {editflag == 1 && fieled === index ? (
                  <div className="drop-div">
                    <label for="matches">Choose a category:</label>
                    <div>
                      <select onChange={e => editCategory(e, index)}>
                        {category &&
                          category.map(i => (
                            <option value={i._id}>{i.name}</option>
                          ))}
                      </select>
                    </div>
                  </div>
                ) : null}
                <h2>Email :</h2>
                <p>{i.email}</p>{" "}
                {editflag == 1 && fieled === index ? (
                  <input
                    type="email"
                    placeholder={data[index].email}
                    value={data[index].email}
                    onChange={e => mailHandler(e, index)}
                  />
                ) : null}
                <h2>DB ID :</h2>
                <p>{i._id}</p>
                {/* <p>{i.password}</p> */}
                <button onClick={() => showField(index)}>Edit</button>
                <button onClick={() => deletedata(index)}>Delete</button>
                <p> </p>
                {editflag == 1 && fieled === index ? (
                  <button onClick={() => hideField(index)}>Done</button>
                ) : null}
                {i.status == 1 ? (
                  <button onClick={() => changeStatus(index)}>Deactive</button>
                ) : (
                  <button onClick={() => changeStatus(index)}>Activate</button>
                )}
                <hr></hr>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default AdminPage;
