import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import SignUp from "./Components/SignUp";
import Login from "./Components/Login";
import Check from "./Components/Check";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Home from "./Components/Home";
import AdminPage from "./Components/AdminPage";
import UserPage from "./Components/UserPage";
import Navbar from "./Components/Navbar";
import cookie from "react-cookies";
import ErrorPage from "./Components/ErrorPage";
import ForgotPasswordPage from "./Components/ForgotPasswordPage";
import ResetPassword from "./Components/ResetPassword";
import AllBlogs from "./Components/AllBlogs";

function App() {
  const [cookiePresent, setCookiePresent] = useState();
  const [flag, setFlag] = useState(false);
  const [flag2, setFlag2] = useState();

  useEffect(() => {
    setCookiePresent(document.cookie);
    if (document.cookie) {
      setFlag2(true);
      setFlag(true);
    }
  }, [flag]);

  /*
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/user/all")
      .then(res => console.log(res));
  });
*/

  return (
    <div className="App">
      <>
        <BrowserRouter>
          {/* Always use link inside router */}
          <Navbar
            setCookiePresent={setCookiePresent}
            cookiePresent={cookiePresent}
            flag={flag}
            setFlag={setFlag}
          />

          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/forgot" component={ForgotPasswordPage} />
            <Route
              exact
              path="/resetpassword:token"
              component={ResetPassword}
            />

            {/* <Route exact path="/login" component={Login} /> */}
            <Route exact path="/dashboard" component={Check} />
            {/* <Route exact path="/adminpage" component={AdminPage} /> */}
            {/* <Route exact path="/userpage" component={UserPage} /> */}

            <Route
              exact
              path="/login"
              render={() => <Login flag={flag} setFlag={setFlag} />}
            />

            <Route
              exact
              path="/allblogs"
              render={() =>
                flag ? <AllBlogs /> : <Login flag={flag} setFlag={setFlag} />
              }
            />

            {/* 
            <Route
              exact
              path="/adminpage"
              render={props => (flag ? <AdminPage /> : <h1>Login First</h1>)}
            />

            <Route
              exact
              path="/userpage"
              render={props => (flag ? <UserPage /> : <h1>Login First</h1>)}
            /> */}

            <Route path="*" component={ErrorPage} />
          </Switch>
          {/* {!flag && flag2 && flag2==false && <Redirect to="/login" />} */}
        </BrowserRouter>
      </>
    </div>
  );
}

export default App;
