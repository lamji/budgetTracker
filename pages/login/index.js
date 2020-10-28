import { useState, useContext } from 'react';
import { Card, Jumbotron,Row, Col,  Navbar} from 'react-bootstrap'
import { GoogleLogin } from 'react-google-login'
import Router from 'next/router'
import Swal from 'sweetalert2'
import UserContext from '../../UserContext';
import AppHelper from '../../app-helper'
import RegLogin from '../reLogin/index'

export default function Login(){
    const { user, setUser } = useContext(UserContext)
    const [tokenId, setTokenId] = useState(null)
   

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
            if (typeof data.accessToken !== 'undefined') {
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
        <Jumbotron className="shadow bg-white mt-0 p-0">
        <Navbar bg="dark" className="text-center mx-auto">
            <Navbar.Brand href="#home ">
            <img
                src="/logo.png"
                width="40"
                height="40"
                className="text-center"
                alt="React Bootstrap logo"
            />
            </Navbar.Brand>
            <h4 className="text-white">iTrack</h4>
        </Navbar>
            <Row className="m-0">
                <Col xs={12} md={7} className="">
                <Card.Img src="./login.svg" alt="Card-image"  className="card-image-overlay" />
                </Col>  
                <Col xs={12} md={4} className="text-center LoginHolder px-2 shadow">
                <RegLogin />
                <hr />
                <Col className="text-center mb-4 px-1">
                <h6 className="text-muted">Login Using Social Account</h6>
                <GoogleLogin
                            clientId="481882809701-abbu00gnpcn2jo4kqv3hhi7ovv4v38mr.apps.googleusercontent.com"
                            buttonText="Login"
                            onSuccess={ authenticateGoogleToken }
                            onFailure={ authenticateGoogleToken }
                            cookiePolicy={ 'single_host_origin' }
                            className="socialButton p-0 mx-auto"
                        />
                </Col>
                </Col>
            </Row>
        </Jumbotron>
        </React.Fragment>
    )
}