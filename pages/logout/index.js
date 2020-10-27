import { useContext, useEffect } from 'react';
import UserContext from '../../UserContext';
import Router from 'next/router';

export default function index(){
	const {unsetUser, setUser} = useContext(UserContext)

	useEffect(() => {
		unsetUser();
		Router.push('/login')
	}, [])

	return null
}