import {useState, useEffect} from 'react';
import { Form, Button, Container,Row, Col, Card } from 'react-bootstrap';
import Router from 'next/router'
import AppHelper from '../../app-helper'
import Swal from 'sweetalert2'
import Link from 'next/link'

export default function index() {
    const [user, setUser] = useState('')
    const [email, setEmail] = useState('')
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
    const [firstName, setfirstName] = useState('')
    const [lastName, setlastName] = useState('')
    const [recovery, setRecovery] = useState('')
    const [image, setImage] = useState('https://s3.amazonaws.com/37assets/svn/765-default-avatar.png')
    //state to determine whether submit button is enabled or not
    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        if((email !== '' && password1 !== '' && password2 !== '') && (password1 === password2)){
            setIsActive(true);
        }else{
            setIsActive(false)
        }
    }, [email, password1, password2])

    const retrieveUserDetails = (accessToken) => {
        const options = {
            headers: { Authorization: `Bearer ${ accessToken }` } 
        }

        fetch(`${ AppHelper.API_URL }/users/details`, options).then(AppHelper.toJSON).then(data => {
            setUser({ email: data.email })
            Swal.fire(
                'Good job!',
                'Acount Created',
                'success'
              )
            if(data.categories.length === 0 && data.transactions.length === 0  ){
                Router.push('/noRecord')
            }else{
                Router.push('/profile')
            }
            
        })
    }
  
    function registerUser(e){
        e.preventDefault();
       
        fetch(`${ AppHelper.API_URL }/users/verify-Emailregister-id-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullName: firstName + " " + lastName,
                email: email,
                image: image,
                recovery: recovery,
                password: password1, 
                loginType: "Email"
            })
        }).then(AppHelper.toJSON).then(data => {
            console.log(data)
            if (typeof data.accessToken !== 'undefined') {
                localStorage.setItem('token', data.accessToken)
                retrieveUserDetails(data.accessToken)
            } else {
                if (data.error === 'Email-Exist') {
                    Swal.fire('Registraion  Error', 'Email already Exist.', 'error')
                    setEmail('')
                    setPassword1('')
                    setPassword2('')
                    setfirstName('')
                    setlastName('')
                }else if(data.error === 'email-recovery-exist'){
                    Swal.fire('Registraion  Error', 'Recovery Email already Exist.', 'error')
                    setEmail('')
                    setPassword1('')
                    setPassword2('')
                    setfirstName('')
                    setlastName('')
                }
            }
        })
    }
    return (
        <React.Fragment>
        <Container className="shadow">
            <Row>
                <Col xs={12} md={6} className="my-3">
                <Card.Img src="./signup.svg" alt="Card-image"  className="card-image-overlay" />
                </Col>  
                <Col xs={12} md={4} className="text-center LoginHolder shadow">
                <Form onSubmit={(e) => registerUser(e)}>
                <h4 className="text-muted text-left mb-4">Register User</h4>
                <Row className="m-0">
                    <Col xs={6} className="px-0">
                    <Form.Group controlId="firstName">
                        <Form.Control type="text"  className="inputText" placeholder="Enter First Name" value={firstName} onChange={e => setfirstName(e.target.value)} required/>
                    </Form.Group>
                    </Col>
                    <Col xs={6} className="px-0">
                    <Form.Group controlId="lasttName">
                        <Form.Control type="text"  className="inputText" placeholder="Enter last Name" value={lastName} onChange={e => setlastName(e.target.value)} required/>
                    </Form.Group>
                    </Col>
                </Row>
                
                    <Form.Group controlId="userEmail">
                        <Form.Control type="email"  className="inputText" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} required/>
                    </Form.Group>

                    <Form.Group controlId="RecEmail">
                        <Form.Control type="email"  className="inputText" placeholder="Email Recovery(Optional)" value={recovery} onChange={e => setRecovery(e.target.value)}/>
                    </Form.Group>
                    
                <Row className="m-0">
                    <Col className="px-0">
                    <Form.Group controlId="password1">
                        <Form.Control type="password"  className="inputText" placeholder=" Enter Password" value={password1} onChange={e => setPassword1(e.target.value)} required/>
                    </Form.Group>
                    </Col>
                    <Col className="px-0">
                    <Form.Group controlId="password2">
                        <Form.Control type="password"  className="inputText" placeholder="Verify Password" value={password2} onChange={e => setPassword2(e.target.value)} required/>
                    </Form.Group>
                    </Col>
                </Row>
                    {isActive ?
                        <>
                        <Button variant="outline-primary" className="button text-muted ml-1 " type="submit" id="submitBtn">Register</Button>
                        <Link href="/login">
                        <p className="text-10 pointer">Already have an account? Login Here</p>
                        </Link>
                        </>
                        :
                        <><Button  variant="outline-danger" className="button text-muted ml-1 " type="submit" id="submitBtn" disabled>Register</Button>
                        <Link href="/login">
                        <p className="text-10 pointer">Already have an account? Login Here</p>
                        </Link>
                        </>
                    }
                </Form>
                </Col>
            </Row>
        </Container>
        </React.Fragment>
    )
}