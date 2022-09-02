import React from "react";
import { Link } from "react-router-dom";
import { Card, Row, Col, Container } from "react-bootstrap";
import mailSent from "../../assets/images/mail_sent.svg";

function ConfirmRequest() {
  return (
    <div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5} xxl={4}>
            <Card>
              <Card.Header className="p-0 text-center bg-primary">
                <Link to="/login">
                  <p className="fs-1 fw-bold m-2 text-light">Tekton</p>
                </Link>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="text-center m-auto">
                  <img src={mailSent} alt="mail sent" height="64" />
                  <h4 className="text-dark-50 text-center mt-4 fw-bold">
                    Almost done!
                  </h4>
                  <p className="text-muted mb-4">
                    We have sent an email with a confirmation link to your email
                    address. In order to complete the sign-up process, please click the
                    confirmation link.
                  </p>
                  <p className="text-center">
                    <Link className="btn btn-primary" to="/login">
                      Back to Login
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ConfirmRequest;
