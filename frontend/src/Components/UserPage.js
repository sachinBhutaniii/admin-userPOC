import axios from "axios";
import React, { useEffect, useState } from "react";
import cookie from "react-cookies";

import { Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import FileBase from "react-file-base64";
import Modal from "react-bootstrap/Modal";

const UserPage = () => {
  const [tokenVal, setTokenVal] = useState("");
  const [Flag, setFlag] = useState(false);
  const [add, setAdd] = useState(false);

  const [myBlogs, setMyBlogs] = useState([]);

  //for new user
  const [blog, setBlog] = useState({
    blogTitle: "",
    blogDescription: "",
    file: "",
  });

  const [show, setShow] = useState(false);
  const handleClose = () => {
    let newObj = {
      blogTitle: "",
      blogDescription: "",
      file: "",
    };
    setBlog(newObj);
    setShow(false);
  };

  const handleShow = () => setShow(true);

  const [details, setDetails] = useState({
    _id: "",
    name: "",
    email: "",
    password: "",
    role: "",
    category: "",
    file: "",
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
          // console.log("Extracted data is ", result);

          setDetails({
            ...details,
            _id: result.data._id,
            name: result.data.name,
            password: result.data.password,
            email: result.data.email,
            role: result.data.role,
            category: result.data.category,
            file: result.data.file,
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
        // console.log("RESPONSE of put request: ", res);
        // console.log("RESPONSE", res.status);
        alert("Successfully Updated");
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  };

  useEffect(() => {
    // console.log("User Blogs", details._id);
    //use Effect for getting blogs of a particular user
    details._id &&
      axios
        .get(`http://localhost:8080/api/user/getMyBlogs/${details._id}`)
        .then((result) => {
          setMyBlogs(result.data);
          console.log("My Blogs", result.data);
        })
        .catch((err) => console.log(err));
  }, [details, add]);

  const sendBlogAddRequest = (e) => {
    e.preventDefault();
    console.log("Final data is ", blog);

    const tok = cookie.load("auth-token");
    setTokenVal(tok);

    tokenVal &&
      axios
        .post(
          `http://localhost:8080/api/user/postblogs`,
          blog,
          tokenVal && {
            headers: {
              "auth-token": tokenVal, //the token is a variable which holds the token
            },
          }
        )
        .then((result) => {
          console.log("Result is ", result);
          setShow(false);
          setAdd(!add);
        })
        .catch((err) => console.log(err));
  };

  const deleteBlog = (id) => {
    axios
      .delete(`http://localhost:8080/api/user/deleteBlog/${id}`)
      .then((result) => {
        console.log("result delte", result);
        if (result.status == 200) alert("Blog Successfully Deleted");
        setAdd(!add);
      })
      .catch((err) => console.log("Error while deleting", err));
  };

  return (
    <div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="blogform">
            <form onSubmit={sendBlogAddRequest}>
              <label className="bloglabel"> Blog Title : </label>
              <br />
              <input
                type="text"
                name="name"
                value={blog.blogTitle}
                onChange={(e) =>
                  setBlog({ ...blog, blogTitle: e.target.value })
                }
              />
              <br />
              <label className="bloglabel"> Blog Picture : </label>
              <br />
              <FileBase
                type="file"
                multiple={false}
                onDone={({ base64 }) => setBlog({ ...blog, file: base64 })}
              />
              <br />
              <label className="bloglabel">Blog Description :</label>
              <br />
              <input
                type="text"
                value={blog.blogDescription}
                onChange={(e) =>
                  setBlog({ ...blog, blogDescription: e.target.value })
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
        </Modal.Body>
      </Modal>
      <h1>Welcome to User dashboard</h1>
      {/* <h2>{details.name}</h2>
      <h2>{details.email}</h2>
      <h2>{details._id}</h2>
      <h2>{details.password}</h2> */}
      <div className="box user-box">
        <Card
          border="dark"
          style={{
            width: "40rem",
            // marginLeft: "450px",
            marginBottom: "15px",
            backgroundColor: "#666666",
          }}
        >
          <Card.Body>
            <h4>Profile Picture</h4>

            <img
              src={details.file}
              style={{
                width: "50%",
                height: "250px",
                borderRadius: "50%",
              }}
              alt="profile pic"
            />
            <br></br>

            {Flag ? (
              <FileBase
                type="file"
                multiple={false}
                onDone={({ base64 }) =>
                  setDetails({ ...details, file: base64 })
                }
              />
            ) : null}
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
      <Button variant="dark" onClick={handleShow}>
        ADD A NEW BLOG
      </Button>
      <br></br>
      <hr className="hrblog"></hr>

      <div className="">
        <h2>My Blogs</h2>

        <div className="row  myblogss">
          {myBlogs &&
            myBlogs.map((blog) => (
              <div className="p-2 col-6">
                <Card
                  border="dark"
                  style={{
                    width: "40rem",
                    backgroundColor: "#000000",
                    borderRadius: "20px",
                  }}
                >
                  <Card.Body>
                    <div>
                      <p className="blogtxt"> {blog.name}</p>
                      <img
                        src={blog.file}
                        style={{
                          width: "80%",
                          height: "350px",
                          borderRadius: "10%",
                        }}
                        alt="profile pic"
                      />
                      <p className="blogtxt  blogDescTitle">Description :</p>
                      <p className="blogtxt  blogDesc">{blog.description}</p>
                    </div>
                  </Card.Body>
                  <div className="ButtonDiv">
                    <Button
                      variant="danger"
                      style={{ width: "90%", borderRadius: "10px" }}
                      onClick={() => deleteBlog(blog._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
