import { useState, useEffect } from 'react';

import '../styles/globals.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

import { UserProvider } from '../UserContext';
import AppHelper from '../app-helper';

function MyApp({ Component, pageProps }) {

	const [user, setUser] = useState({
		email: null,
	
	})

	useEffect(() => {
		const accessToken  = localStorage.getItem('token')

		const options = {
            headers: { Authorization: `Bearer ${ accessToken }` } 
        }

        fetch(`${ AppHelper.API_URL }/users/details`, options).then(AppHelper.toJSON).then(data => {
            setUser({ email: data.email})
        })
        
	}, [user.email])

	const unsetUser = () => {
		localStorage.clear();

		setUser({
			email: null,
		})
	}

  return(
  	<UserProvider value={{user, setUser, unsetUser}}>
	  	<Component {...pageProps} />
  	</UserProvider>
  )
}

export default MyApp
