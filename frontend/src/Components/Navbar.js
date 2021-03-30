import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import "./custom.css";
import cookie from "react-cookies";
const Navbar = ({ setCookiePresent, cookiePresent, flag, setFlag }) => {
  const [isRedirect, setIsRedirect] = useState(false);
  useEffect(() => {
    setCookiePresent(document.cookie, console.log("In Logout ", cookiePresent));
  }, [cookiePresent]);

  useEffect(() => {
    console.log("Cookie in navbar", cookiePresent);
  });

  const clearCookie1 = () => {
    cookie.remove("auth-token");
    setCookiePresent("");
    setFlag(false);
    setIsRedirect(true);
  };

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/"> Home </Link>
          </li>

          {flag ? (
            <li>
              <button onClick={clearCookie1}>Logout</button>
            </li>
          ) : (
            <li>
              <Link to="/login"> Login </Link>
            </li>
          )}
        </ul>
      </nav>

      {isRedirect ? <Redirect to="/" /> : null}
    </div>
  );
};

export default Navbar;
