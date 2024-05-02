'use client'

import styles from './page.module.scss'
import MDocCard from './home_page/card'
import Header from './_components/Header/page'
import NewDoc from './home_page/NewDoc'
import { auth, db } from '@/firebase/firebase'
import { DocumentData, QuerySnapshot, collection, getDocs } from 'firebase/firestore'
import { User, onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'
import Login from './_components/Header/login'
import classNames from 'classnames'

export default function Home() {
	const [currentUser, setCurrentUser] = useState<User | undefined>()
	const [userDocs, setUserDocs] = useState<QuerySnapshot<DocumentData, DocumentData>>()

	onAuthStateChanged(auth, async (user) => {
		if (user) {
			setCurrentUser(user)
		} else {
			setCurrentUser(undefined)
		}
	})

	useEffect(() => {
		if (currentUser) getDocuments()

		async function getDocuments() {
			const docs = await getDocs(collection(db, 'users', currentUser!.uid, 'user-documents'))

			setUserDocs(docs)
		}
	}, [currentUser])

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
					) : userDocs ? (
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
							<h4>Oops, looks like you don't have any documents...</h4>
							<NewDoc currentUser={currentUser} />
						</>
					)}
				</div>
			</main>
		</>
	)
}
