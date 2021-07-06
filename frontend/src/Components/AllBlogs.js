import React, { useEffect, useState } from "react";
import axios from "axios";
import "./custom.css";

import { Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import FileBase from "react-file-base64";

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/user/allBlogs`)
      .then((result) => setBlogs(result.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <h1>All Blogs</h1>
      {blogs &&
        blogs.map((blog) => (
          <Card
            border="dark"
            style={{
              width: "40rem",
              marginLeft: "450px",
              marginBottom: "15px",
              backgroundColor: "#171717",
            }}
          >
            <Card.Body>
              <div className="row">
                <div className="col">
                  <img
                    src={blog.author.file}
                    style={{
                      width: "45%",
                      height: "60px",
                      borderRadius: "50%",
                      paddingBottom: "5px",
                    }}
                    alt="profile pic"
                  />
                </div>
                <div className="col">
                  <h4 className="authname">{blog.author.name}</h4>
                </div>
                <div className="col"></div>
                <hr></hr>
              </div>

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
          </Card>
        ))}
    </>
  );
};

export default AllBlogs;
