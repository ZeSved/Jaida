'use client'

import styles from '@/app/@children/page.module.scss'
import Header from '../_components/Header/page'
import { db } from '@/db/firebase'
import {
	DocumentData,
	QuerySnapshot,
	collection,
	doc,
	getDoc,
	onSnapshot,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import Login from '../_components/Header/login'
import classNames from 'classnames'
import { LoadingSq } from '@/components/loading/loadingSquare'
import { useAuthState } from '../hooks/useAuthState'
import { database } from '@/db/api'
import ItemList from './ItemList'

export default function HomePage() {
	const user = useAuthState()
	const [userDocs, setUserDocs] = useState<QuerySnapshot<DocumentData, DocumentData> | undefined>(
		undefined
	)
	const [folders, setFolders] = useState<string[]>(['Home'])

	useEffect(() => {
		if (user) {
			const unsub = onSnapshot(
				collection(db, 'users', user.uid, 'user-documents'),
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
						console.log(result.data()![f][1])
						// setFolders([...folders, f])
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
						<div className={styles.directory}></div>
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
