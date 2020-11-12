import { useState, useContext, useEffect } from 'react';
import { Card, Jumbotron, Navbar, Button , Row, Col, Nav, Image, Dropdown, Container, NavDropdown} from 'react-bootstrap'
import Link from 'next/link'

import AppHelper from '../../app-helper'
export default function Login(){
    const [userName, setUserName] = useState('')
    const [image, setImage] = useState('')
    const [email, setEmail] =useState('')
    const [loginType, setLogin] =useState('')
    const [number, setNumber] = useState('Add Number')
    const [address, setAddress] = useState('Add Address')

    useEffect(() =>{
        fetch(`${ AppHelper.API_URL }/users/details`,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
           console.log(data)
           setUserName(data.fullName)
           setEmail(data.email)
           setImage(data.image)
           setLogin(data.loginType)
        })

    },[])   
	return(
        <React.Fragment>
        <Row variant="" className="m-0 py-1 bg-light">
            <Col xs={12} md={6} className="logo">
                <h4>Budget Tracker App</h4>
            </Col>
            <Col xs={12} md={6} className="welcomicon w-100">
            <Dropdown>
            <Dropdown.Toggle variant="light" className="p-0 text-12 px-3" id="dropdown-basic">
            <Image className="profile-Img" src={image}  />
            {userName}
            </Dropdown.Toggle>
            <Dropdown.Menu className="link-menu">
                <Card.Text className="p-0 pb-3 mb-0 px-3 text-secondary text-center"><b>Login Type:</b>  {loginType}</Card.Text>
                <Row>
                    <Col xs={9}>
                    <Card.Text className="p-0 mb-0 px-3 text-secondary"><Image className="profile-icon " src="https://www.pngkey.com/png/detail/195-1957052_contact-us-comments-contact-icon-png.png" />{number}</Card.Text>
                    </Col>
                    <Col xs={3} className="text-right px-4">
                    <Image className="edit-icon" src="https://www.nicepng.com/png/detail/810-8105676_png-file-svg-transparent-background-edit-icons-png.png" />
                    </Col>
                </Row>
                <Row>
                    <Col xs={9}>
                    <Card.Text className="p-0 mb-0 px-3 text-secondary"><Image className="profile-icon " src="https://www.pngkey.com/png/detail/195-1957052_contact-us-comments-contact-icon-png.png" />{address}</Card.Text>
                    </Col>
                    <Col xs={3} className="text-right px-4">
                    <Image className="edit-icon" src="https://www.nicepng.com/png/detail/810-8105676_png-file-svg-transparent-background-edit-icons-png.png" />
                    </Col>
                </Row>
                
                <Card.Text className="p-0 mb-0 px-3 text-secondary"><Image className="profile-icon " src="https://www.kindpng.com/picc/m/49-496199_icons-envelope-computer-mail-message-email-email-icon.png" />{email}</Card.Text>
                <Link href="/logout">
                <a className="nav-link text-secondary" role="button"><hr /><Image className="profile-icon " src="https://www.pngkey.com/png/detail/208-2083760_close-comments-log-out-icon-vector-png.png" />Logout</a>
                </Link>
            </Dropdown.Menu>
            </Dropdown>     
            </Col>
        </Row>
        <Jumbotron className="custom-jumbo">
            <h1>Hello, world!</h1>
            <p>
                This is a simple hero unit, a simple jumbotron-style component for calling
                extra attention to featured content or information.
            </p>
            <p>
                <Button variant="primary">Learn more</Button>
            </p>
            </Jumbotron>
        </React.Fragment>
	)
}	