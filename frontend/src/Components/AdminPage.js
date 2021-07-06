import axios from "axios";
import React, { useEffect, useState } from "react";
import cookie from "react-cookies";
import { Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import FileBase from "react-file-base64";

const AdminPage = () => {
  const [data, setData] = useState();
  const [tokenVal, setTokenVal] = useState("");
  const [editflag, setEditFlag] = useState();
  const [fieled, setField] = useState(); //do diplay input field on that index only
  const [demo, setDemo] = useState(false);
  //for adding user
  // const [user, setUser] = useState(false);
  //search
  const [searchTerm, setSeachterm] = useState({
    name: "",
  });
  const [searchResult, setSeachResult] = useState();

  //for new user
  const [addUser, setAddUser] = useState({
    name: "",
    email: "",
    password: "",
    category: "",
    file: "",
  });

  const [category, setCategory] = useState();
  const [userForm, setUserForm] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => {
    let newObj = {
      name: "",
      email: "",
      password: "",
      category: "",
      file: "",
    };
    setAddUser(newObj);
    setShow(false);
  };
  const handleShow = () => setShow(true);

  //for delete modal
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => {
    setShow2(false);
    setToBeDel();
  };
  const handleShow2 = (index) => {
    setToBeDel(index);
    setShow2(true);
  };

  const [toBeDel, setToBeDel] = useState();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/category/all")
      .then((res) => {
        // console.log("Categories RECEIVED: ", res.data);
        setCategory(res.data);
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }, []);

  useEffect(() => {
    // console.log(searchTerm);

    //search API
    searchTerm &&
      searchTerm.name.length > 0 &&
      axios
        .post("http://localhost:8080/api/admin/search", searchTerm)
        .then((res) => {
          setSeachResult(res.data);
          console.log("SEARCH RESULT", res);
          //
        });
  }, [searchTerm.name]);

  const sendRequest = (e) => {
    e.preventDefault();
    // setUserForm(true);

    console.log("Form Submitting.....");

    axios
      .post("http://localhost:8080/api/user/register", addUser)
      .then((res) => {
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
        setDemo(!demo);
        handleClose();
      })
      .catch((err) => {
        // console.log("AXIOS ERROR: ", err.response.data.message);
        alert(err.response?.data.errors);
      });

    //redirecting
  };

  const handleDropdown = (e) => {
    console.log("Selected value", e.target.value);
    // setSelectedCategory(e.target.value);
    setAddUser({ ...addUser, category: e.target.value });
  };

  const showField = (index) => {
    setField(index);
    setEditFlag(1);
  };

  const hideField = (index) => {
    setField(index);
    setEditFlag(0);
    // setUser(!user);
    axios
      .put(`http://localhost:8080/api/user/${data[index]._id}`, data[index])
      .then((res) => {
        console.log("RESPONSE of put request: ", res);
        console.log("RESPONSE", res.status);
        alert("Successfullt added");
        setDemo(!demo);
      })
      .catch((err) => {
        alert(err.response.data.errors);
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
  // const getCategory = id => {
  //   // console.log(id);
  //   const categ = category.filter(cat => cat._id == id);
  //   // console.log("Cat is ", categ);
  //   return categ[0].name; //filter returns an object
  // };

  const deletedata = (index) => {
    console.log("Index to be deleted recieved is ", index);
    // console.log(data[index]._id);

    axios
      .delete(`http://localhost:8080/api/user/${data[index]._id}`)
      .then((res) => {
        // console.log("RESPONSE of put request: ", res);
        // setData(res.data);
        console.log("RESPONSE of delte", res);
        setDemo(!demo);
        handleClose2();
      })
      .catch((err) => {
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
        .then((result) => {
          // console.log("Extracted data is ", result);
          setData(result.data);
        })
        .catch((err) => console.log(err));
  }, [tokenVal, userForm, demo]); // pass user state here for rerender

  useEffect(() => {
    //extracting name from category id
    data &&
      data.category &&
      axios
        .get(`http://localhost:8080/api/category/${data.category}`)
        .then((result) => {
          console.log("Category ", result);
          setData({ ...data, category: result.data.name });
        });
  });

  const changeStatus = (index) => {
    //
    console.log("Account to be changed ", data[index]);

    if (data[index].status == 1) data[index].status = 0;
    else data[index].status = 1;

    axios
      .put(`http://localhost:8080/api/user/${data[index]._id}`, data[index])
      .then((res) => {
        console.log("RESPONSE of put request: ", res);
        console.log("RESPONSE", res.status);
        setDemo(!demo);
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
        alert(err.response?.data?.errors);
        setDemo(!demo);
      });
  };

  return (
    <div>
      <h1>Welcome to admin dashboard</h1>
      <h3 style={{ color: "grey" }}>Search Users</h3>
      <input
        type="text"
        onChange={(e) => setSeachterm({ ...searchTerm, name: e.target.value })}
      />
      <br></br>
      <br></br>
      <hr></hr>
      <Button
        variant="dark"
        /* onClick={() => setUserForm(true) } */
        onClick={handleShow}
      >
        ADD USER
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Enter User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-content">
            <div className="drop-div">
              <label for="matches">Choose a category:</label>
              <div>
                <select
                  className="category"
                  onChange={(e) => handleDropdown(e)}
                >
                  {category &&
                    category.map((i) => (
                      <option value={i._id}>{i.name}</option>
                    ))}
                </select>
              </div>
            </div>
            <br></br>

            <div className="form-div-modal">
              <form onSubmit={sendRequest}>
                Name :
                <br />
                <input
                  type="text"
                  name="name"
                  value={addUser.name}
                  onChange={(e) =>
                    setAddUser({ ...addUser, name: e.target.value })
                  }
                />
                <br />
                ProflePic :
                <br />
                <FileBase
                  type="file"
                  multiple={false}
                  onDone={({ base64 }) =>
                    setAddUser({ ...addUser, file: base64 })
                  }
                />
                <br />
                Email :
                <br />
                <input
                  type="email"
                  name="email"
                  value={addUser.email}
                  onChange={(e) =>
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
                  onChange={(e) =>
                    setAddUser({ ...addUser, password: e.target.value })
                  }
                />
                <br />
                <br />
                <Button variant="info" type="submit">
                  Done
                </Button>
                <Button
                  style={{ marginLeft: "15px" }}
                  variant="secondary"
                  onClick={handleClose}
                >
                  Close
                </Button>
                <br />
              </form>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <br></br>
      <br></br>

      <Modal
        show={show2}
        onHide={handleClose2}
        backdrop="static"
        keyboard={false}
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete User ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you Sure You Want To Delete This User ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Close
          </Button>
          <Button variant="danger" onClick={() => deletedata(toBeDel)}>
            Yes , I am sure
          </Button>
        </Modal.Footer>
      </Modal>

      <br></br>
      <br></br>

      <div className="row">
        {searchTerm &&
        searchTerm.name.length > 0 &&
        searchResult &&
        searchResult.length > 0 ? (
          searchResult.map((i, index) => (
            <div className="row">
              <div className="p-2 col-md-4">
                <Card
                  border="dark"
                  style={{
                    width: "40rem",
                    marginLeft: "450px",
                    marginBottom: "15px",
                    backgroundColor: "#666666",
                  }}
                >
                  <Card.Body>
                    {i.role == 1 ? null : (
                      <div>
                        <h4>Profile Picture</h4>
                        <img
                          src={i.file}
                          style={{
                            width: "50%",
                            height: "250px",
                            borderRadius: "50%",
                          }}
                          alt="profile pic"
                        />
                        <div className="row info">
                          <div className="col"></div>
                          <div className="col">
                            <h4>Name :</h4>
                          </div>
                          <div className="col">
                            <p>{i.name}</p>
                          </div>
                          <div className="col"></div>
                        </div>
                        {editflag == 1 && fieled === index ? (
                          <input
                            type="text"
                            placeholder={data[index].name}
                            value={data[index].name}
                            onChange={(e) => nameHandler(e, index)}
                          />
                        ) : null}
                        <div className="row">
                          <div className="col"></div>
                          <div className="col">
                            <h4>Role:</h4>
                          </div>
                          <div className="col">
                            <p>User </p>
                          </div>
                          <div className="col"></div>
                        </div>

                        <div className="row">
                          <div className="col"></div>
                          <div className="col">
                            <h4>Category:</h4>
                          </div>
                          <div className="col">
                            <p>{i.category.name}</p>
                          </div>
                          <div className="col"></div>
                        </div>
                        {editflag == 1 && fieled === index ? (
                          <div className="drop-div">
                            <label for="matches">Choose a category:</label>
                            <div>
                              <select onChange={(e) => editCategory(e, index)}>
                                {category &&
                                  category.map((i) => (
                                    <option value={i._id}>{i.name}</option>
                                  ))}
                              </select>
                            </div>
                          </div>
                        ) : null}
                        <div className="row">
                          <div className="col"></div>
                          <div className="col">
                            <h4>Email:</h4>
                          </div>
                          <div className="col">
                            <p>{i.email}</p>
                          </div>
                          <div className="col"></div>
                        </div>
                        {editflag == 1 && fieled === index ? (
                          <input
                            type="email"
                            placeholder={data[index].email}
                            value={data[index].email}
                            onChange={(e) => mailHandler(e, index)}
                          />
                        ) : null}
                        <div className="row">
                          <div className="col"></div>
                          <div className="col">
                            <h4>DB ID:</h4>
                          </div>
                          <div className="col">
                            <p>{i._id}</p>
                          </div>
                          <div className="col"></div>
                        </div>

                        {/* <p>{i.password}</p> */}
                        <Button
                          variant="secondary"
                          onClick={() => showField(index)}
                          style={{ marginRight: "4px" }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="warning"
                          // onClick={() => deletedata(index)}
                          onClick={() => handleShow2(index)}
                        >
                          Delete
                        </Button>
                        <p> </p>
                        {editflag == 1 && fieled === index ? (
                          <Button
                            style={{ marginRight: "4px" }}
                            onClick={() => hideField(index)}
                          >
                            Done
                          </Button>
                        ) : null}
                        {i.status == 1 ? (
                          <Button
                            variant="danger"
                            onClick={() => changeStatus(index)}
                          >
                            Deactive
                          </Button>
                        ) : (
                          <Button
                            variant="danger"
                            onClick={() => changeStatus(index)}
                          >
                            Activate
                          </Button>
                        )}
                        <hr></hr>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </div>
            </div>
          ))
        ) : searchTerm && searchTerm.name.length > 0 ? (
          <h2 style={{ color: "red" }}>No Such User</h2>
        ) : (
          <div className="row">
            <h1>All User</h1>
            {data &&
              data.map((i, index) => (
                <div className="p-2 col-md-4">
                  <Card
                    border="dark"
                    style={{
                      width: "30rem",
                      // marginLeft: "450px",
                      // marginBottom: "15px",
                      backgroundColor: "#666666",
                      borderRadius: "75px",
                    }}
                  >
                    <Card.Body>
                      {i.role == 1 ? null : (
                        <div>
                          <h4>Profile Picture</h4>
                          <img
                            src={i.file}
                            style={{
                              width: "50%",
                              height: "250px",
                              borderRadius: "50%",
                            }}
                            alt="profile pic"
                          />
                          <div className="row info">
                            <div className="col"></div>
                            <div className="col">
                              <h4>Name :</h4>
                            </div>
                            <div className="col">
                              <p>{i.name}</p>
                            </div>
                            <div className="col"></div>
                          </div>
                          {editflag == 1 && fieled === index ? (
                            <input
                              type="text"
                              placeholder={data[index].name}
                              value={data[index].name}
                              onChange={(e) => nameHandler(e, index)}
                            />
                          ) : null}
                          <div className="row">
                            <div className="col"></div>
                            <div className="col">
                              <h4>Role:</h4>
                            </div>
                            <div className="col">
                              <p>User </p>
                            </div>
                            <div className="col"></div>
                          </div>

                          <div className="row">
                            <div className="col"></div>
                            <div className="col">
                              <h4>Category:</h4>
                            </div>
                            <div className="col">
                              <p>{i.category.name}</p>
                            </div>
                            <div className="col"></div>
                          </div>
                          {editflag == 1 && fieled === index ? (
                            <div className="drop-div">
                              <label for="matches">Choose a category:</label>
                              <div>
                                <select
                                  onChange={(e) => editCategory(e, index)}
                                >
                                  {category &&
                                    category.map((i) => (
                                      <option value={i._id}>{i.name}</option>
                                    ))}
                                </select>
                              </div>
                            </div>
                          ) : null}
                          <div className="row">
                            <div className="col"></div>
                            <div className="col">
                              <h4>Email:</h4>
                            </div>
                            <div className="col">
                              <p>{i.email}</p>
                            </div>
                            <div className="col"></div>
                          </div>
                          {editflag == 1 && fieled === index ? (
                            <input
                              type="email"
                              placeholder={data[index].email}
                              value={data[index].email}
                              onChange={(e) => mailHandler(e, index)}
                            />
                          ) : null}
                          <div className="row">
                            <div className="col">
                              <h4>DB ID :</h4>
                            </div>
                            <div className="col">
                              <p>{i._id}</p>
                            </div>
                          </div>

                          {/* <p>{i.password}</p> */}
                          <Button
                            variant="secondary"
                            onClick={() => showField(index)}
                            style={{ marginRight: "4px" }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="warning"
                            // onClick={() => deletedata(index)}
                            onClick={() => handleShow2(index)}
                          >
                            Delete
                          </Button>
                          <p> </p>
                          {editflag == 1 && fieled === index ? (
                            <Button
                              style={{ marginRight: "4px" }}
                              onClick={() => hideField(index)}
                            >
                              Done
                            </Button>
                          ) : null}
                          {i.status == 1 ? (
                            <Button
                              variant="danger"
                              onClick={() => changeStatus(index)}
                            >
                              Deactive
                            </Button>
                          ) : (
                            <Button
                              variant="danger"
                              onClick={() => changeStatus(index)}
                            >
                              Activate
                            </Button>
                          )}
                          <hr></hr>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
