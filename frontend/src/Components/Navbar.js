import React, { useEffect, useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import "./custom.css";
import cookie from "react-cookies";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = ({ setCookiePresent, cookiePresent, flag, setFlag }) => {
  const [isRedirect, setIsRedirect] = useState();
  let history = useHistory();

  useEffect(() => {
    setCookiePresent(document.cookie, console.log("In Logout ", cookiePresent));
  }, [cookiePresent]);

  useEffect(() => {
    console.log("Cookie in navbar", cookiePresent);
  });

  const clearCookie1 = () => {
    history.push("/");
    cookie.remove("auth-token");
    setCookiePresent("");
    setFlag(!flag);
  };

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Button variant="outline-primary">
              <Link to="/"> Home </Link>
            </Button>
          </li>

          {flag ? (
            <>
              <li>
                <Button variant="info">
                  <Link className="dash" to="/allblogs">
                    {" "}
                    All Blogs{" "}
                  </Link>
                </Button>
              </li>
              <li>
                <Button variant="secondary">
                  <Link className="dash" to="/dashboard">
                    {" "}
                    DashBoard{" "}
                  </Link>
                </Button>
              </li>
              <li>
                <Button variant="danger" onClick={clearCookie1}>
                  Logout
                </Button>
              </li>
            </>
          ) : (
            <li>
              <Button variant="outline-secondary">
                <Link to="/login"> Login </Link>
              </Button>
            </li>
          )}
        </ul>
      </nav>

      {isRedirect ? <Redirect to="/" /> : null}
    </div>
  );
};

export default Navbar;
