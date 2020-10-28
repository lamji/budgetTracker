import { useState, useEffect } from 'react';
import { Jumbotron,  Button, Card } from 'react-bootstrap'
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
           <Jumbotron className="custom-jumbo text-center getJumbo">
           <Card className="p-4 welcomeText bg-dark text-white py-5">
            <h3>Welcome! <br /> {userName}</h3>
                <p className="text-white txt-10">
                    This is a simple budget tracker App.
                </p>
                <p className="text-white text-10">
                    For trial version deleting record will not affect your balance and editing record are not include.
                </p>
                <Link href="/addData">
                    <Button variant="primary">Get Started</Button>
                </Link>
           </Card>
           
            </Jumbotron>
       </React.Fragment>
	)
}	