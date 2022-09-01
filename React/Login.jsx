import React, { useState } from 'react';
import AccountLayout from './AccountLayout';
import toastr from 'toastr';
import userService from '../../services/userService';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import debug from 'sabio-debug';
import { useTranslation } from 'react-i18next';
import { Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Formik.css';
import loginFormSchema from '../../schemas/loginSchema';
import PropTypes from 'prop-types';

function Login(prop) {
    const _logger = debug.extend('Login');
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [userFormData] = useState({
        email: '',
        password: '',
    });

    const BottomLink = () => {
        const { t } = useTranslation();
        return (
            <Row className="mt-3">
                <Col className="text-center">
                    <p className="text-muted">
                        {t("Don't have an account?")}
                        <Link to={'/register'} className="text-muted ms-1">
                            <b>{t('Sign Up')}</b>
                        </Link>
                    </p>
                </Col>
            </Row>
        );
    };

    const handleSubmit = (values) => {
        _logger(values);
        userService.login(values).then(onLoginSuccess).catch(onLoginError);
    };

    const onLoginSuccess = () => {
        prop.currentUser.isLoggedIn = true;
        userService.currentUser().then(onCurrentUserSuccess).catch(onCurrentUserError);
        toastr.success('Login success');
    };

    const onLoginError = (error) => {
        _logger('onLoginError', error);
        toastr.error('Login failed');
    };

    const onCurrentUserSuccess = (data) => {
        _logger(data.item.roles);
        if (data.item.roles.includes('Subcontractor')) {
            navigate('/dashboard/subcontractor');
        } else {
            navigate('/');
        }
    };

    const onCurrentUserError = (err) => {
        _logger('onCurrentUserError', err);
        toastr.error("The current user's information couldn't be retrieved. " + err);
    };

    return (
        <React.Fragment>
            <AccountLayout bottomLinks={<BottomLink />}>
                <div className="text-center w-75 m-auto">
                    <h4 className="text-dark-50 text-center mt-0 fw-bold">{t('Sign In')}</h4>
                    <p className="text-muted mb-4">
                        {t('Enter your email address and password to access your account.')}
                    </p>
                </div>
                <Formik
                    enableReinitialize={true}
                    initialValues={userFormData}
                    onSubmit={handleSubmit}
                    validationSchema={loginFormSchema}>
                    <Form className="">
                        <div className="mb-3">
                            <label htmlFor="email">Email</label>
                            <Field
                                label={t('Email address')}
                                type="text"
                                name="email"
                                placeholder="Enter your email"
                                className="form-control"
                            />
                            <ErrorMessage name="email" component="div" className="has-error" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password">Password</label>
                            <Link to={'/resetpassword'} className="text-muted float-end">
                                <small>{t('Forgot your password?')}</small>
                            </Link>
                            <Field
                                label={t('Password')}
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                className="form-control"
                            />
                            <ErrorMessage name="password" component="div" className="has-error" />
                        </div>

                        <div className="mt-2 text-center">
                            <Button variant="primary" type="submit">
                                {t('Log In')}
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
