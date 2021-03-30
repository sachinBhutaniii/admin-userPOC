import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import SignUp from "./Components/SignUp";
import Login from "./Components/Login";
import Check from "./Components/Check";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./Components/Home";
import AdminPage from "./Components/AdminPage";
import UserPage from "./Components/UserPage";
import Navbar from "./Components/Navbar";
import cookie from "react-cookies";
import ErrorPage from "./Components/ErrorPage";

function App() {
  const [cookiePresent, setCookiePresent] = useState();
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    setCookiePresent(
      document.cookie,
      console.log("Value of cookie in app js ", cookiePresent)
    );
    console.log("Cookie Appjs");
    if (document.cookie) setFlag(true);
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
              path="/adminpage"
              render={props => (flag ? <AdminPage /> : <h1>Login First</h1>)}
            />

            <Route
              exact
              path="/userpage"
              render={props => (flag ? <UserPage /> : <h1>Login First</h1>)}
            />

            <Route path="*" component={ErrorPage} />
          </Switch>
        </BrowserRouter>
      </>
    </div>
  );
}

export default App;
