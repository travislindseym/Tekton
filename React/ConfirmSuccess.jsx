import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, Row, Col, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import userService from "../../services/userService";
import logouticon from "../../assets/images/logout-icon.svg";

function ConfirmSuccess() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const term = params.get("token");

  let payload = {
    Token: term,
  };

  const [seconds, setSeconds] = useState(4);

  useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      navigate("/login");
    }
  });

  useEffect(() => {
    userService.confirm(payload).then(onConfirmSuccess).catch(onConfirmError);
  }, []);

  const onConfirmSuccess = () => {
    toastr.success("Account confirmed!");
  };

  const onConfirmError = () => {
    toastr.error("Error confirming account");
  };
  return (
    <React.Fragment>
      <div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5} xxl={4}>
              <Card>
                <Card.Header className="p-0 text-center bg-primary">
                  <Link to="/">
                    <p className="fs-1 fw-bold m-2 text-light">Tekton</p>
                  </Link>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="text-center m-auto">
                    <img src={logouticon} alt="mail sent" height="64" />
                    <h4 className="text-dark-50 text-center mt-4 fw-bold">
                      Thanks for confirming your account!
                    </h4>
                    <p className="text-muted mb-4">
                      You will be redirected in {seconds}...
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default ConfirmSuccess;
