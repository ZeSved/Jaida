'use client'
import { auth, db } from '@/firebase/firebase'
import { GoogleAuthProvider, signOut, signInWithRedirect } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { doc, setDoc } from 'firebase/firestore'

import s from './header.module.scss'
import Image from 'next/image'
import acc from '@/public/account.svg'
import { useEffect } from 'react'
import { useUser } from '@/app/hooks/useUser'

export default function Login() {
	const router = useRouter()
	const currentUser = useUser()

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
		return `${currentUser?.photoURL}?w=50&q=75`
	}

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
