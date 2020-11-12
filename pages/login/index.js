import { useState, useContext } from 'react';
import { Card, Jumbotron,Row, Col, Modal, Image} from 'react-bootstrap'
import { GoogleLogin } from 'react-google-login'
import Router from 'next/router'
import Swal from 'sweetalert2'
import UserContext from '../../UserContext';
import AppHelper from '../../app-helper'
import RegLogin from '../reLogin/index'

export default function Login(){
    const { user, setUser } = useContext(UserContext)
    const [tokenId, setTokenId] = useState(null)
    const [show, setShow] = useState(false);
   

    const retrieveUserDetails = (accessToken) => {
        const options = {
            headers: { Authorization: `Bearer ${ accessToken }` } 
        }

        fetch(`${ AppHelper.API_URL }/users/details`, options).then(AppHelper.toJSON).then(data => {
                setUser({ email: data.email })
                if(data.categories.length === 0 && data.transactions.length === 0  ){
                    Router.push('/noRecord')
                }else{
                    Router.push('/addData')
                }
        })
    }

    const authenticateGoogleToken = (response) => {
        setTokenId(response.tokenId)
        const payload = {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tokenId: response.tokenId })
        }

        fetch(`${ AppHelper.API_URL }/users/verify-google-id-token`, payload).then(AppHelper.toJSON).then(data => {
            if(typeof data.accessToken !== 'undefined') {
                setShow(false)
                localStorage.setItem('token', data.accessToken)
                retrieveUserDetails(data.accessToken)

            } else {
                if (data.error === 'google-auth-error') {
                    Swal.fire('Google Auth Error', 'Google authentication procedure failed, try again or contact web admin.', 'error')
                } else if (data.error === 'login-type-error') {
                    Swal.fire('Login Type Error', 'This email has already taken, try another email.', 'error')
                }
            }
        })
    }
    return (
        <React.Fragment>
        <Jumbotron className=" p-0 Login-Jumbotron">
            <h2 className="text-center text-white pt-3">I-Track</h2>
            <p className="text-center text-white text-10">Simple but yet powerful expenses and income tracker</p>
            <Row className="mx-auto form-Holder">
                <Col xs={12} md={7} className="">
                    <Card.Img src="./login.png" alt="Card-image"  className="card-image-overlay" />
                </Col>  
                <Col xs={12} md={4} className="LoginHolder mt-0 p-0 text-center">
                <RegLogin />
                <hr />
                <Col className="text-center px-1">
                <GoogleLogin
                            clientId="481882809701-abbu00gnpcn2jo4kqv3hhi7ovv4v38mr.apps.googleusercontent.com"
                            buttonText="Login Using Google"
                            onSuccess={ authenticateGoogleToken }
                            onFailure={ authenticateGoogleToken }
                            cookiePolicy={ 'single_host_origin' }
                            className="socialButton p-0 mx-auto w-100"
                            block
                        />
                </Col>
                </Col>
            </Row>
                <hr />
            <Row className="m-0 content-Holder">
            <Col md={6} xs={12} className="mx-auto login-content">
                <Row className="m-0">
                    <Col md={4} xs={12} className="text-center text-10">
                        <Image src="./res.png" className="login-content-image"/>
                        <p>Responsive Web Design, You can use any device anytime, anywhre.</p>
                    </Col>
                    <Col md={4} xs={12} className="text-center text-10">
                        <Image src="./crud.png" className="login-content-image"/>
                        <p>Including CRUD operation, You can add, delete, update and read your expenses and income.</p>
                    </Col>
                    <Col md={4} xs={12} className="text-center text-10">
                        <Image src="./charts.jpg" className="login-content-image"/>
                        <p>You can view the trends expenses and income in chart.</p>
                    </Col>
                </Row>
            </Col>
        </Row>

        </Jumbotron>
       
        </React.Fragment>
    )
}