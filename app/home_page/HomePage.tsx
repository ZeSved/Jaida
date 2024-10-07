'use client'

import styles from '@/app/@children/page.module.scss'
import MDocCard from './card'
import Header from '../_components/Header/page'
import NewDoc from './NewDoc'
import { auth, db } from '@/db/firebase'
import { DocumentData, QuerySnapshot, collection, doc, onSnapshot } from 'firebase/firestore'
import { User, onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'
import Login from '../_components/Header/login'
import classNames from 'classnames'
import { LoadingSq } from '@/components/loading/loadingSquare'
import Sidebar from '../_components/Sidebar/Sidebar'
import { useAuthState } from '../hooks/useAuthState'
import ItemList from './ItemList'
import { database } from '@/db/api'

export default function HomePage() {
	const user = useAuthState()
	const [userDocs, setUserDocs] = useState<QuerySnapshot<DocumentData, DocumentData> | undefined>(
		undefined
	)

	useEffect(() => {
		if (user) {
			const unsub = onSnapshot(
				collection(db, 'users', user.uid, 'user-documents'),
				(queryResult) => {
					setUserDocs(queryResult)
				}
			)

			console.log(
				database
					.getDocument(
						doc(
							db,
							'users',
							user.uid,
							'user-documents',
							'DOC-fb623c64-ee08-4fd9-a7a6-70a1805fd889 '
						)
					)
					.getValue()
					.data()
			)
			return () => unsub()
		} else {
			setUserDocs(undefined)
		}
	}, [user])

	return (
		<>
			<Header />
			<main className={styles.container}>
				{user === undefined && (
					<div className={classNames(styles.main, styles.noUser)}>
						<h2 className={styles.h2}>Sign in to continue</h2>
						<Login />
					</div>
				)}

				{/* {userDocs && userDocs.size < 1 && (
					<div className={classNames(styles.main, styles.noDocs)}>
						<h4 className={styles.h4}>Oops, looks like you don&apos;t have any documents...</h4>
						<NewDoc currentUser={currentUser!} />
					</div>
				)} */}

				{userDocs && (
					<div className={styles.main}>
						<ItemList items={userDocs} />
						<ItemList
							items={userDocs}
							forDocuments
						/>
						{/* <NewDoc currentUser={user!} /> */}
					</div>
				)}
			</main>
		</>
	)
}
