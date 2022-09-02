import React, { useState } from "react";
import AccountLayout from "./AccountLayout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import userService from "../../services/userService";
import loginFormSchema from "../../schemas/loginSchema";
import PropTypes from "prop-types";
import toastr from "toastr";
import "./Formik.css";

function Login(prop) {
  const navigate = useNavigate();

  const [userFormData] = useState({
    email: "",
    password: "",
  });

  const BottomLink = () => {
    return (
      <Row className="mt-3">
        <Col className="text-center">
          <p className="text-muted">
            Don't have an account?
            <Link to={"/register"} className="text-muted ms-1">
              <b>Sign Up</b>
            </Link>
          </p>
        </Col>
      </Row>
    );
  };

  const handleSubmit = (values) => {
    userService.login(values).then(onLoginSuccess).catch(onLoginError);
  };

  const onLoginSuccess = () => {
    prop.currentUser.isLoggedIn = true;
    userService.currentUser().then(onCurrentUserSuccess).catch(onCurrentUserError);
    toastr.success("Login success");
  };

  const onLoginError = () => {
    toastr.error("Login failed");
  };

  const onCurrentUserSuccess = (data) => {
    if (data.item.roles.includes("Subcontractor")) {
      navigate("/dashboard/subcontractor");
    } else {
      navigate("/");
    }
  };

  const onCurrentUserError = () => {
    toastr.error("The current user's information couldn't be retrieved.");
  };

  return (
    <React.Fragment>
      <AccountLayout bottomLinks={<BottomLink />}>
        <div className="text-center w-75 m-auto">
          <h4 className="text-dark-50 text-center mt-0 fw-bold">Sign In</h4>
          <p className="text-muted mb-4">
            Enter your email address and password to access your account.
          </p>
        </div>
        <Formik
          enableReinitialize={true}
          initialValues={userFormData}
          onSubmit={handleSubmit}
          validationSchema={loginFormSchema}
        >
          <Form>
            <div className="mb-3">
              <label htmlFor="email">Email</label>
              <Field
                label="Email address"
                type="text"
                name="email"
                placeholder="Enter your email"
                className="form-control"
              />
              <ErrorMessage name="email" component="div" className="has-error" />
            </div>
            <div className="mb-3">
              <label htmlFor="password">Password</label>
              <Link to={"/resetpassword"} className="text-muted float-end">
                <small>Forgot your password?</small>
              </Link>
              <Field
                label="Password"
                type="password"
                name="password"
                placeholder="Enter your password"
                className="form-control"
              />
              <ErrorMessage name="password" component="div" className="has-error" />
            </div>

            <div className="mt-2 text-center">
              <Button variant="primary" type="submit">
                Log In
              </Button>
            </div>
          </Form>
        </Formik>
      </AccountLayout>
    </React.Fragment>
  );
}

Login.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
  }),
};

export default Login;
