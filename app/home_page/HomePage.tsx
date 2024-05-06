'use client'

import styles from '@/app/page.module.scss'
import MDocCard from './card'
import Header from '../_components/Header/page'
import NewDoc from './NewDoc'
import { auth, db } from '@/firebase/firebase'
import { DocumentData, QuerySnapshot, collection, getDocs, onSnapshot } from 'firebase/firestore'
import { User, onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'
import Login from '../_components/Header/login'
import classNames from 'classnames'

export default function HomePage() {
	const [currentUser, setCurrentUser] = useState<User | undefined>()
	const [userDocs, setUserDocs] = useState<QuerySnapshot<DocumentData, DocumentData>>()

	onAuthStateChanged(auth, async (user) => {
		if (user) {
			setCurrentUser(user)
		} else {
			setCurrentUser(undefined)
		}
	})

	if (currentUser) {
		const unsub = onSnapshot(
			collection(db, 'users', currentUser.uid, 'user-documents'),
			(queryResult) => {
				queryResult.docChanges().forEach((change) => {
					if (change.type === 'added') {
						setTimeout(() => setUserDocs(queryResult), 2000)
					}
				})

				setUserDocs(queryResult)
			}
		)
	}

	// useEffect(() => {
	// 	if (currentUser) getDocuments()

	// 	async function getDocuments() {
	// 		const docs = await getDocs(collection(db, 'users', currentUser!.uid, 'user-documents'))

	// 	}
	// }, [currentUser])

	return (
		<>
			<Header />
			<main className={styles.container}>
				<div
					className={classNames(
						styles.main,
						!currentUser && styles.noUser,
						userDocs && userDocs?.size < 1 && styles.noDocs
					)}>
					{!currentUser ? (
						<>
							<h2>Sign in to continue</h2>
							<Login />
						</>
					) : userDocs && userDocs.size >= 1 ? (
						<>
							{userDocs.docs.map((d) => (
								<MDocCard
									id={d.data().name}
									name={d.data().name}
									key={d.data().id}
									displayName={d.data().displayName}
									currentUser={currentUser}
								/>
							))}
							<NewDoc currentUser={currentUser} />
						</>
					) : (
						<>
							<h4>Oops, looks like you don&apos;t have any documents...</h4>
							<NewDoc currentUser={currentUser} />
						</>
					)}
				</div>
			</main>
		</>
	)
}
