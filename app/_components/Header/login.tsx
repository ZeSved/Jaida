'use client'
import { auth } from '@/firebase/firebase'
import {
	getRedirectResult,
	GoogleAuthProvider,
	signOut,
	signInWithRedirect,
	User,
} from 'firebase/auth'
import s from './header.module.scss'
import Image from 'next/image'
import { useState } from 'react'
import acc from '@/public/account.svg'
import { useRouter } from 'next/navigation'

export default function Login() {
	const [user, setUser] = useState<User | undefined>()
	const router = useRouter()

	const loader = () => {
		return `https://lh3.googleusercontent.com/a/ACg8ocLI1TK2uWFgg5btl0LszNfk3qFjy7o8wEEVk6ICiM5XG_D015TG=s96-c`
	}

	getRedirectResult(auth)
		.then((result) => {
			// This gives you a Google Access Token. You can use it to access Google APIs.
			// const credential = GoogleAuthProvider.credentialFromResult(result);
			// const token = credential.accessToken;

			// The signed-in user info.
			const user = result?.user
			console.log(user?.email)
			setUser(user)
			// IdP data available using getAdditionalUserInfo(result)
			// ...
		})
		.catch((error) => {
			// Handle Errors here.
			const errorCode = error.code
			const errorMessage = error.message
			// The email of the user's account used.
			const email = error.customData.email
			// The AuthCredential type that was used.
			const credential = GoogleAuthProvider.credentialFromError(error)
			// ...
		})

	return (
		<>
			<button className={s.login}></button>
			<Image
				loader={loader}
				src={user ? user!.photoURL : acc}
				alt='profile picture'
				height={50}
				width={50}
			/>
			<div className={s.popup}>
				<button
					onClick={() =>
						signOut(auth)
							.then(() => {
								setUser(undefined)
								router.push('/')
								console.log(user)
							})
							.catch((err) => {
								alert(`Could not log out due to the following error: ${err}`)
							})
					}>
					Log Out
				</button>
				<button
					onClick={() => {
						const provider = new GoogleAuthProvider()
						signInWithRedirect(auth, provider)
					}}>
					Log In
				</button>
			</div>
		</>
	)
}
