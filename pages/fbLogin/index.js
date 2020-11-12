import FacebookLogin from 'react-facebook-login'
import { useState, useContext } from 'react';
import Router from 'next/router'
import AppHelper from '../../app-helper'
import UserContext from '../../UserContext';
import Swal from 'sweetalert2'

export default function fbLogin(){
    const { user, setUser } = useContext(UserContext)

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

    const responseFacebook = (response) => {
        fetch(`${ AppHelper.API_URL }/users/verify-facebook-id-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullName: response.name,
                email: response.email,
                image: response.picture.data.url,
                loginType: "Facebook"
            })
        }).then(AppHelper.toJSON).then(data => {
            if (typeof data.accessToken !== 'undefined') {
                localStorage.setItem('token', data.accessToken)
                retrieveUserDetails(data.accessToken)
            }else{
                Swal.fire('Registration Failed', 'Email already Exist.', 'error')
            }
        })
    }
    const clickComponent = () => {
    }
  
    return(
        <React.Fragment>
              <FacebookLogin
                appId="1550753008443315"
                fields="name,email,picture"
                onClick={clickComponent}
                callback={responseFacebook}
                textButton="Login"
                cssClass="socialButton"
                icon="fa-facebook" />
        </React.Fragment>
      
    )
} 