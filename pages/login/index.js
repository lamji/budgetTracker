import { useState, useContext } from "react";
import { Card, Jumbotron, Row, Col, Modal, Image } from "react-bootstrap";
import { GoogleLogin } from "react-google-login";
import Router from "next/router";
import Swal from "sweetalert2";
import UserContext from "../../UserContext";
import AppHelper from "../../app-helper";
import RegLogin from "../reLogin/index";

export default function Login() {
  const { user, setUser } = useContext(UserContext);
  const [tokenId, setTokenId] = useState(null);
  const [show, setShow] = useState(false);

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

  const authenticateGoogleToken = (response) => {
    setTokenId(response.tokenId);
    const payload = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokenId: response.tokenId }),
    };

    fetch(`${AppHelper.API_URL}/users/verify-google-id-token`, payload)
      .then(AppHelper.toJSON)
      .then((data) => {
        if (typeof data.accessToken !== "undefined") {
          setShow(false);
          localStorage.setItem("token", data.accessToken);
          retrieveUserDetails(data.accessToken);
        } else {
          if (data.error === "google-auth-error") {
            Swal.fire(
              "Google Auth Error",
              "Google authentication procedure failed, try again or contact web admin.",
              "error"
            );
          } else if (data.error === "login-type-error") {
            Swal.fire(
              "Login Type Error",
              "This email has already taken, try another email.",
              "error"
            );
          }
        }
      });
  };
  return (
    <React.Fragment>
      <Jumbotron className=" p-0 Login-Jumbotron">
        <Row className="mx-auto form-Holder">
          <Col xs={12} md={4} className="LoginHolder mt-0 p-0 text-center">
            <RegLogin />
          </Col>
        </Row>
      </Jumbotron>
    </React.Fragment>
  );
}
