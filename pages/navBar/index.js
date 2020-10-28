import { useState, useEffect } from 'react';
import { Card, Row, Col, Image, Dropdown,Modal,Button, Form } from 'react-bootstrap'
import Link from 'next/link'
import Swal from 'sweetalert2'

import AppHelper from '../../app-helper'    

export default function index(){
    const [userName, setUserName] = useState('')
    const [image, setImage] = useState('')
    const [email, setEmail] =useState('')
    const [loginType, setLogin] =useState('')
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [newPassword, setNewPassword] = useState('')
    const [userId, setUserId] = useState('')
    useEffect(() =>{
        fetch(`${ AppHelper.API_URL }/users/details`,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
           setUserName(data.fullName)
           setEmail(data.email)
           setImage(data.image)
           setLogin(data.loginType)
           setUserId(data._id)
        })

    },[]) 
 
    const editPassword = (e) =>{
        e.preventDefault();
        
        fetch(`${ AppHelper.API_URL }/users/changePass`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
            },
            body: JSON.stringify({ 
                newPassword: newPassword,
                userId:userId
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data === true){
                Swal.fire(
                    'Password Changed',
                    '',
                    'success'
                  )
                  setShow(false)
                  setNewPassword('')
            }
           
        })
    }
    return(
        <React.Fragment>
        <Row variant="" className="m-0 py-1 bg-dark text-white">
            <Col xs={12} md={9} className="logo">
                <h4 className="my-3">iTrack</h4>
            </Col>
            <Col xs={12} md={3} className="p-2">
            <Dropdown>
            <Dropdown.Toggle variant="light" className="p-0 py-2" id="dropdown-basic">
            <Image className="profile-Img ml-2" src={image}  />
            {userName}
            </Dropdown.Toggle>
            <Dropdown.Menu className="link-menu">
                {loginType === "Google" || loginType === "Facebook" ? null :
                <Card.Text className="p-0 mb-0 px-3 text-secondary pointer" onClick={() => handleShow()}>Edit Password</Card.Text>
                }
                <Card.Text className="p-0  mb-0 px-3 text-secondary"><b>Login Type:</b>  {loginType}</Card.Text>
                <Card.Text className="p-0  mb-0 px-3 text-secondary pointer"><b>Premium not yet available </b></Card.Text>
                <Card.Text className="p-0 mb-0 px-3 text-secondary">{email}</Card.Text>
                <Link href="/logout">
                <a className="nav-link text-secondary text-center" role="button"><hr /><Image className="profile-icon " src="https://www.pngkey.com/png/detail/208-2083760_close-comments-log-out-icon-vector-png.png" />Logout</a>
                </Link>
            </Dropdown.Menu>
            </Dropdown>     
            </Col>
        </Row>
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Body>
            <Form onSubmit={(e) =>  editPassword(e)} className="mb-3 ">
                    <Form.Group md={6} controlId="amount" className="addAmountForm1">
                        <Form.Control type="password"  className="inputText" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required/>
                    </Form.Group>
                    <Button variant="outline-primary" className="button text-muted ml-1 " type="submit" id="submitBtn2">Save</Button>
            </Form>
            </Modal.Body>
        </Modal>
        </React.Fragment>
    )
}
