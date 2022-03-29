import { useState, useEffect, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import UserContext from "../../UserContext";
import Link from "next/link";
import AppHelper from "../../app-helper";
import Router from "next/router";
import Swal from "sweetalert2";

export default function index() {
  const { setUser } = useContext(UserContext);
  //states for form input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    if (password !== "" && email !== "") {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  });

  const retrieveUserDetails = (accessToken) => {
    const options = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    fetch(`${AppHelper.API_URL}/users/details`, options)
      .then(AppHelper.toJSON)
      .then((data) => {
        setUser({ email: data.email });
        if (data.categories.length === 0 && data.transactions.length === 0) {
          Router.push("/noRecord");
        } else {
          Router.push("/addData");
        }
      });
  };

  function loginUser(e) {
    e.preventDefault();
    fetch(`${AppHelper.API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        //successful authentication will return a JWT via the response accessToken property
        if (data.accessToken) {
          localStorage.setItem("token", data.accessToken);
          retrieveUserDetails(data.accessToken);
        } else {
          if (data.error === "Email-not-found") {
            Swal.fire("Login Failed", "Invalid Email.", "error");
          } else if (data.error === "Incorrect-Password") {
            Swal.fire("Login Failed", "Invalid Password.", "error");
          }
        }
      });
  }

  return (
    <Form onSubmit={(e) => loginUser(e)}>
      <h4 className="text-muted text-center my-4">Budget Tracker Login</h4>
      <Form.Group controlId="userEmail">
        <Form.Control
          type="email"
          className="inputText"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Form.Text className="text-muted"></Form.Text>
      </Form.Group>
      <Form.Group controlId="password">
        <Form.Control
          className="inputText"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>
      {isActive ? (
        <>
          <Button
            type="submit"
            id="submitBtn"
            className="button text-muted mr-1 btn-sm"
          >
            Login
          </Button>
          <Link href="/register">
            <Button
              className="button text-muted ml-1 px-2 btn-sm"
              id="signUp"
              variant="outline-info"
            >
              Sign Up
            </Button>
          </Link>
        </>
      ) : (
        <>
          <Button
            type="submit"
            id="submitBtn"
            variant="outline-danger"
            className="button text-muted ml-1 btn-sm"
            disabled
          >
            Login
          </Button>
          <Link href="/register">
            <Button
              className="button text-muted ml-1 px-2 btn-sm"
              id="signUp"
              variant="outline-info"
            >
              Sign Up
            </Button>
          </Link>
        </>
      )}
    </Form>
  );
}
