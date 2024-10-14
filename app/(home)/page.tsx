'use client'

import {
	DocumentData,
	DocumentSnapshot,
	QuerySnapshot,
	collection,
	doc,
	getDoc,
	onSnapshot,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import classNames from 'classnames'
import { db } from '@/db/firebase'
import Login from '@/app/_components/Header/_components/login'
import Header from '@/app/_components/Header/page'
import ItemList from './_components/ItemList'
import { useAuthState } from '@/hooks/useAuthState'
import styles from './page.module.scss'
import { useDirectory } from '@/hooks/useDirectory'
import Loading from '@/components/loading/Loading'
import Card from './_components/card'
import { Folder, Snapshot } from '@/db/types'

export default function HomePage() {
	const user = useAuthState()
	const [userDocs, setUserDocs] = useState<Snapshot | undefined>(undefined)
	const [userFolders, setUserFolders] = useState<Folder[]>([])
	const [folders, setFolders] = useState<{ id: string; name: string }[]>([{ name: 'Home', id: '' }])
	const { path, goForwardTo } = useDirectory(user)
	// const [directory, setDirectory] = useState<string[]>([])

	useEffect(() => {
		if (user) {
			const dir = `users/${user!.uid}/user-documents`
			// setDirectory(dir.split('/'))

			// console.log(path)
			const removeDocumentSnapshot = onSnapshot(
				collection(db, path.length > 1 ? path.join('/') : dir),
				(queryResult) => {
					setUserDocs(queryResult)
				}
			)

			// console.log(path)
			// console.log(path, '_sub_folders_')
			console.log(doc(db, path.length > 1 ? path.join('/') : dir, '_sub_folders_'))

			const removeFolderSnapshot = onSnapshot(
				doc(db, path.length > 1 ? path.join('/') : dir, '_sub_folders_'),
				(queryResult) => {
					const fold = []
					for (const f in queryResult.data()) {
						const folder = queryResult.data()![f]
						console.log(folder)
						setFolders([...folders, { name: folder.name, id: folder.id }])
						fold.push(folder)
					}
					setUserFolders(fold)
				}
			)

			return () => {
				removeDocumentSnapshot()
				removeFolderSnapshot()
			}
		} else {
			setUserDocs(undefined)
		}
	}, [user, path])

	return (
		<>
			<Header />
			<main className={styles.container}>
				<Loading condition={user === null}>
					{user === undefined && (
						<div className={classNames(styles.main, styles.noUser)}>
							<h2 className={styles.h2}>Sign in to continue</h2>
							<Login />
						</div>
					)}

					{user && (
						<>
							<div className={styles.directory}>
								{folders.map(({ name, id }, i) => (
									<div key={i}>
										<p>{name}</p>
										<div />
									</div>
								))}
							</div>

							<div className={styles.main}>
								<ItemList
									items={userFolders}
									path={path}>
									{userFolders.map(({ id, numberOfDocs, name, lastModified }, i) => (
										<Card
											key={i}
											currentUser={user!}
											id={id}
											dateModified={lastModified}
											displayName={name}
											numberOfPages={numberOfDocs}
											goForwardTo={goForwardTo}
										/>
									))}
								</ItemList>
								<ItemList
									path={path}
									items={userDocs?.docs.filter((d) => d.id !== '_sub_folders_')}
									forDocuments>
									{userDocs?.docs.map((d, i) => {
										if (d.id !== '_sub_folders_')
											return (
												<Card
													goForwardTo={goForwardTo}
													id={d.data().name}
													key={i}
													displayName={d.data().displayName}
													currentUser={user!}
													numberOfPages={d.data().numberOfPages}
													dateModified={d.data().dateModified}
													forDocuments
												/>
											)
									})}
								</ItemList>
							</div>
						</>
					)}
				</Loading>
			</main>
		</>
	)
}
