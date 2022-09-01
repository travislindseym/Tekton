import React, { useState, useEffect } from 'react';
import AccountLayout from './AccountLayout';
import userService from '../../services/userService';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import debug from 'sabio-debug';
import { useTranslation } from 'react-i18next';
import { Button, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Formik.css';
import registerSchema from '../../schemas/registerSchema';
import Swal from 'sweetalert2';
import TermsOfServiceContent from '../landing/TermsOfServiceContent';
import * as siteReferenceService from '../../services/siteReferenceService';
import toastr from 'toastr';

function Register() {
    const _logger = debug.extend('Register');
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [userFormData] = useState({
        email: '',
        password: '',
        passwordConfirm: '',
        agreeTerms: false,
        newRefType: '',
    });

    const [refTypes, setRefTypes] = useState([]);

    const [selection, setSelection] = useState({ id: null, name: null });

    useEffect(() => {
        siteReferenceService.getRefs().then(onGetRefTypesSuccess).catch(onGetRefTypesError);
    }, []);

    const otherSelection = () => {
        return (
            <div className="mt-3">
                <Field
                    label={t('Other')}
                    type="text"
                    name="newRefType"
                    placeholder="Enter Reference Name"
                    className="form-control"
                />
            </div>
        );
    };

    const addRefType = otherSelection();

    const [modal, setModal] = useState({
        show: false,
    });

    const BottomLink = () => {
        const { t } = useTranslation();
        return (
            <Row className="mt-3">
                <Col className="text-center">
                    <p className="text-muted">
                        {t('Already have account?')}
                        <Link to={'/login'} className="text-muted ms-1">
                            <b>{t('Log In')}</b>
                        </Link>
                    </p>
                </Col>
            </Row>
        );
    };

    var renderModal = () => {
        return (
            <React.Fragment>
                <Modal size={'xl'} show={modal.show}>
                    <ModalHeader className="fw-bold fs-3">Terms and Conditions</ModalHeader>
                    <ModalBody>
                        <TermsOfServiceContent></TermsOfServiceContent>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="button" color onClick={onClickCloseModal}>
                            Close
                        </Button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        );
    };

    let onClickTerms = () => {
        setModal((prevState) => {
            let md = { ...prevState };
            md.show = true;
            return md;
        });
    };

    var onClickCloseModal = () => {
        setModal((prevState) => {
            var newState = { ...prevState };
            newState.show = false;
            return newState;
        });
    };

    const handleSubmit = (values) => {
        _logger(values);
        let payload = values;
        let { agreeTerms, ...newPayload } = payload;
        _logger(payload);
        _logger('new payload', newPayload);
        if (agreeTerms) {
            userService.register(newPayload).then(onRegisterSuccess).catch(onRegisterError);
        }
    };

    const onRegisterSuccess = (response) => {
        _logger('onRegisterSuccess', response.item);
        toastr.success('Registration successful!');
        const selectedSiteRef = {};
        selectedSiteRef.referenceTypeId = selection.id;
        selectedSiteRef.userId = response.item;

        siteReferenceService.addSiteRef(selectedSiteRef).then(onSiteRefSuccess).catch(onSiteRefError);
    };

    const onRegisterError = (response) => {
        _logger('onRegisterError', response);
        Swal.fire('Registration failed!', 'Something went wrong', 'error');
    };

    const onSiteRefSuccess = (response) => {
        _logger('onSiteRefSuccess', response);
        navigate('/confirmrequest');
    };

    const onSiteRefError = (err) => {
        _logger(err, 'Error Submitting Site Ref');
        toastr.error('Unable to Submit Reference');
    };

    const onGetRefTypesSuccess = (response) => {
        _logger(response.items);

        setRefTypes(response.items);
    };

    const onGetRefTypesError = (err) => {
        toastr.error('Unable to Get Reference Types');
        _logger(err);
    };

    const refDropdownMapper = (ref) => {
        return (
            <Dropdown.Item
                key={ref.id}
                onClick={() => {
                    setSelection(ref);
                }}>
                {ref.name}
            </Dropdown.Item>
        );
    };

    const dropdownItems = refTypes.map(refDropdownMapper);

    return (
        <React.Fragment>
            <AccountLayout bottomLinks={<BottomLink />}>
                <div className="text-center w-75 m-auto">
                    <h4 className="text-dark-50 text-center mt-0 fw-bold">{t('Register')}</h4>
                    <p className="text-muted mb-4">
                        {t("Don't have an account? Create one, it takes less than a minute.")}
                    </p>
                </div>
                <div className="modal-container">{modal.show && renderModal()}</div>

                <Formik
                    enableReinitialize={true}
                    initialValues={userFormData}
                    onSubmit={handleSubmit}
                    validationSchema={registerSchema}>
                    {({ values }) => (
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
                                <Field
                                    label={t('Password')}
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    className="form-control"
                                />
                                <ErrorMessage name="password" component="div" className="has-error" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="passwordConfirm">Confirm Password</label>
                                <Field
                                    type="password"
                                    name="passwordConfirm"
                                    placeholder="Confirm your password"
                                    className="form-control"
                                />
                                <ErrorMessage name="passwordConfirm" component="div" className="has-error" />
                            </div>
                            <label>Tell us how you heard about us!</label>
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic" className="col-12">
                                    {selection.name !== null ? selection.name : 'Select One'}
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="col-12">{dropdownItems}</Dropdown.Menu>
                            </Dropdown>

                            <div>{selection.name === 'Other' ? addRefType : null}</div>

                            <div className="mt-2">
                                <div className="mb-3 text-muted">
                                    <Field type="checkbox" name="agreeTerms" />
                                    <label className="ms-1">
                                        {t('I accept the')}
                                        <button type="button" className="btn btn-link ps-md1" onClick={onClickTerms}>
                                            <u>Terms and Conditions</u>
                                        </button>
                                    </label>
                                </div>
                                <div className="mt-2 text-center">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={!values.agreeTerms ? true : false}>
                                        {t('Register')}
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </AccountLayout>
        </React.Fragment>
    );
}

export default Register;
