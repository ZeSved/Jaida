'use client'

import {
	DocumentData,
	QuerySnapshot,
	collection,
	doc,
	getDoc,
	onSnapshot,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import classNames from 'classnames'
import { db } from '@/db/firebase'
import Login from './_components/Header/login'
import Header from './_components/Header/page'
import ItemList from './home_page/ItemList'
import { useAuthState } from './hooks/useAuthState'
import styles from './page.module.scss'

export default function HomePage() {
	const user = useAuthState()
	const [userDocs, setUserDocs] = useState<QuerySnapshot<DocumentData, DocumentData> | undefined>(
		undefined
	)
	const [folders, setFolders] = useState<string[]>(['Home'])

	useEffect(() => {
		if (user) {
			const unsub = onSnapshot(
				collection(db, `users/${user.uid}/user-documents`),
				(queryResult) => {
					setUserDocs(queryResult)
				}
			)

			getFolders()

			return () => unsub()
		} else {
			setUserDocs(undefined)
		}

		async function getFolders() {
			await getDoc(doc(db, 'users', user!.uid, 'user-documents', '_sub_folders_')).then(
				(result) => {
					for (const f in result.data()) {
						const name = result.data()![f][1]
						console.log(name)
						if (name !== undefined) {
							setFolders([...folders, result.data()![f][1]])
						}
					}
				}
			)
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

				{user && (
					<>
						<div className={styles.directory}>
							{folders.map((folder) => (
								<>
									<p>{folder}</p>
									<div />
								</>
							))}
						</div>

						<div className={styles.main}>
							<ItemList items={userDocs} />
							<ItemList
								items={userDocs}
								forDocuments
							/>
						</div>
					</>
				)}
			</main>
		</>
	)
}
