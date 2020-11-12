import { useState, useEffect } from 'react';
import { Jumbotron, Card, Alert, Button, Image } from 'react-bootstrap'
import Link from 'next/link'
import NavBar from '../navBar/index'

import AppHelper from '../../app-helper'
export default function Login(){
    const [userName, setUserName] = useState('')
    const [image, setImage] = useState('')
    const [email, setEmail] =useState('')
    const [loginType, setLogin] =useState('')

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
           <NavBar />
           <Jumbotron className="noRec-main">
           <Card className="p-4 welcomeText text-muted pt-4">
            <h3>Welcome! <b className="text-primary">{userName}</b> to iTrack </h3>
                <p className="text-muted text-10">
                    A simple budget tracker that will manage your expenses and income.
                </p>
                   <Link href="/addData">
                    <Button variant="primary" className="mx-auto mb-2" >Get Started</Button>
                </Link>
             <Alert variant="info" className="text-center mx-auto"> POS and inventory feature coming soon!</Alert>
           </Card>
           
            </Jumbotron>
       </React.Fragment>
	)
}	