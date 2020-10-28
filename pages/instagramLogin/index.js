import InstagramLogin from 'react-instagram-login'
import { useState, useContext } from 'react';
import Router from 'next/router'
import AppHelper from '../../app-helper'
import UserContext from '../../UserContext';

export default function fbLogin(){
    const responseInstagram = (response) => {
        console.log(response);
      }
    return(
        <InstagramLogin
        clientId="3575052622547536"
        buttonText="Login"
        onSuccess={responseInstagram}
        onFailure={responseInstagram}
  />
    )
} 