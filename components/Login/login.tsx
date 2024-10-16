'use client'
import { auth, db } from '@/db/firebase'
import {
	GoogleAuthProvider,
	signOut,
	User,
	onAuthStateChanged,
	signInWithPopup,
} from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { doc, getDoc, setDoc } from 'firebase/firestore'

import s from './Login.module.scss'
import Image from 'next/image'
import acc from '@/public/account.svg'
import { useEffect, useState } from 'react'
import { useAuthState } from '@/hooks/useAuthState'
import ShortUniqueId from 'short-unique-id'

export default function Login({ onlyButton = false }: { onlyButton?: boolean }) {
	const router = useRouter()
	const user = useAuthState()
	const [showPopup, setShowPopup] = useState<boolean>(false)

	useEffect(() => {
		if (user) updateDB()

		async function updateDB() {
			try {
				const userDocument = doc(db, 'users', user!.uid)
				const subFolders = doc(db, 'users', user!.uid, 'user-documents', '_sub_folders_')

				const subFolderId = new ShortUniqueId({ length: 9 })

				const userIsNew = (await getDoc(userDocument)).data()?.email === undefined

				if (userIsNew) {
					await setDoc(userDocument, {
						email: user!.email,
						displayName: user!.displayName,
						numberOfDocuments: 0,
						uid: user!.uid,
					})

					await setDoc(subFolders, {
						data: [subFolderId.rnd(), 'New folder'],
					})
				}
			} catch (e) {
				console.log('an error has occured', e)
			}
		}
	}, [user])

	const loader = () => {
		return `${user?.photoURL}?w=60&q=75`
	}

	return !onlyButton ? (
		<>
			<Image
				className={s.login}
				loader={user?.photoURL ? loader : undefined}
				src={user?.photoURL ? user.photoURL : acc}
				alt='profile picture'
				width={'60'}
				height={'60'}
				onClick={() => setShowPopup(!showPopup)}
				style={{ cursor: 'pointer' }}
			/>
			<div className={showPopup ? s.popup : s.display}>
				<button
					onClick={
						user
							? async () => {
									try {
										await signOut(auth)
										router.push('/')
									} catch (err) {
										alert(`Could not log out due to the following error: ${err}`)
									}
							  }
							: async () => {
									const provider = new GoogleAuthProvider()
									await signInWithPopup(auth, provider)
							  }
					}>
					{user ? 'Log Out' : 'Log In'}
				</button>
			</div>
		</>
	) : (
		<button
			onClick={
				user
					? async () => {
							try {
								await signOut(auth)
								router.push('/')
							} catch (err) {
								alert(`Could not log out due to the following error: ${err}`)
							}
					  }
					: async () => {
							const provider = new GoogleAuthProvider()
							await signInWithPopup(auth, provider)
					  }
			}>
			{user ? 'Log Out' : 'Log In'}
		</button>
	)
}
