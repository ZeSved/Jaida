'use client'
// import { initializeApp } from 'firebase/app'
// import { firebaseConfig } from '@/firebase/firebase'
// import { getAuth, signInWithRedirect, getRedirectResult, GoogleAuthProvider } from 'firebase/auth'
import s from './header.module.scss'

export default function Login() {
	// const app = initializeApp(firebaseConfig)
	// const auth = getAuth()

	// getRedirectResult(auth)
	// 	.then((result) => {
	// 		// This gives you a Google Access Token. You can use it to access Google APIs.
	// 		// const credential = GoogleAuthProvider.credentialFromResult(result);
	// 		// const token = credential.accessToken;

	// 		// The signed-in user info.
	// 		const user = result?.user
	// 		console.log(user?.email)
	// 		// IdP data available using getAdditionalUserInfo(result)
	// 		// ...
	// 	})
	// 	.catch((error) => {
	// 		// Handle Errors here.
	// 		const errorCode = error.code
	// 		const errorMessage = error.message
	// 		// The email of the user's account used.
	// 		const email = error.customData.email
	// 		// The AuthCredential type that was used.
	// 		const credential = GoogleAuthProvider.credentialFromError(error)
	// 		// ...
	// 	})

	return (
		<button
			className={s.login}
			// onClick={() => {
			// 	const provider = new GoogleAuthProvider()
			// 	signInWithRedirect(auth, provider)
			// }}
		>
			click me
		</button>
	)
}
