'use client'
import { auth, db } from '@/firebase/firebase'
import {
	getRedirectResult,
	GoogleAuthProvider,
	signOut,
	signInWithRedirect,
	onAuthStateChanged,
	User,
} from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { collection, doc, setDoc } from 'firebase/firestore'

import s from './header.module.scss'
import Image from 'next/image'
import acc from '@/public/account.svg'
import { useEffect, useState } from 'react'

export default function Login() {
	const [currentUser, setCurrentUser] = useState<User | undefined>()
	const router = useRouter()

	useEffect(() => {
		if (currentUser) updateDB()

		async function updateDB() {
			try {
				const userDocument = doc(db, 'users', currentUser!.uid)

				await setDoc(userDocument, {
					email: currentUser?.email,
					displayName: currentUser?.displayName,
					numberOfDocuments: 0,
					uid: currentUser?.uid,
				})
			} catch (e) {
				console.log('an error has occured', e)
			}
		}
	}, [currentUser])

	onAuthStateChanged(auth, (user) => {
		if (user) {
			setCurrentUser(user)
		} else {
			setCurrentUser(undefined)
		}
	})

	const loader = () => {
		return `${currentUser?.photoURL}?w=50&q=75`
	}

	getRedirectResult(auth)
		.then((result) => {
			// This gives you a Google Access Token. You can use it to access Google APIs.
			// const credential = GoogleAuthProvider.credentialFromResult(result);
			// const token = credential.accessToken;

			// The signed-in user info.
			const user = result?.user
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
			{currentUser?.photoURL ? (
				<Image
					loader={loader}
					src={currentUser.photoURL}
					alt='profile picture'
					height={50}
					width={50}
				/>
			) : (
				<Image
					src={acc}
					alt='profile picture'
					height={50}
					width={50}
				/>
			)}
			<div className={s.popup}>
				<button
					onClick={() =>
						signOut(auth)
							.then(() => {
								router.push('/')
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
