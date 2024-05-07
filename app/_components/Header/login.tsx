'use client'
import { auth, db } from '@/firebase/firebase'
import {
	GoogleAuthProvider,
	signOut,
	signInWithRedirect,
	User,
	onAuthStateChanged,
} from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { doc, setDoc } from 'firebase/firestore'

import s from './header.module.scss'
import Image from 'next/image'
import acc from '@/public/account.svg'
import { useEffect, useState } from 'react'
import { useUser } from '@/app/hooks/useUser'

export default function Login() {
	const router = useRouter()
	const [showPopup, setShowPopup] = useState<boolean>(false)
	const [currentUser, setCurrentUser] = useState<User | undefined>()

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setCurrentUser(user)
			} else {
				setCurrentUser(undefined)
			}
		})
	}, [])

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

	const loader = () => {
		return `${currentUser?.photoURL}?w=60&q=75`
	}

	return (
		<>
			<Image
				className={s.login}
				loader={currentUser?.photoURL ? loader : undefined}
				src={currentUser?.photoURL ? currentUser.photoURL : acc}
				alt='profile picture'
				width={'60'}
				height={'60'}
				onClick={() => setShowPopup(!showPopup)}
				style={{ cursor: 'pointer' }}
			/>
			<div className={showPopup ? s.popup : s.display}>
				<button
					onClick={
						currentUser
							? () =>
									signOut(auth)
										.then(() => {
											router.push('/')
										})
										.catch((err) => {
											alert(`Could not log out due to the following error: ${err}`)
										})
							: () => {
									const provider = new GoogleAuthProvider()
									signInWithRedirect(auth, provider)
							  }
					}>
					{currentUser ? 'Log Out' : 'Log In'}
				</button>
			</div>
		</>
	)
}
