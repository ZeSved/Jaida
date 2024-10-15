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
import { createContext, useEffect, useState } from 'react'
import classNames from 'classnames'
import { db } from '@/db/firebase'
import Login from '@/app/_components/Header/_components/login'
import Header from '@/app/_components/Header/page'
import CardContainer from './_components/CardContainer'
import { useAuthState } from '@/hooks/useAuthState'
import styles from './page.module.scss'
import { useDirectory } from '@/hooks/useDirectory'
import Loading from '@/components/loading/Loading'
import Card from './_components/card'
import { Folder, Snapshot } from '@/db/types'
import { User } from 'firebase/auth'
import Directory from './_components/Directory'
import NotFound from './_components/_NotFound/NotFound'

export const PathContext = createContext<string[]>([])
export const UserContext = createContext<User | undefined>(undefined)

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

			const removeDocumentSnapshot = onSnapshot(
				collection(db, path.length > 1 ? path.join('/') : dir),
				(queryResult) => {
					setUserDocs(queryResult)
				}
			)

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
					<NotFound
						message={{
							text: 'Sign in/up to continue',
							dependentValue: user,
							action: <Login onlyButton />,
						}}
					/>

					{user && (
						<>
							<Directory folders={folders} />

							<div className={styles.main}>
								<UserContext.Provider value={user}>
									<PathContext.Provider value={path}>
										<CardContainer items={userFolders}>
											{userFolders.map(({ id, numberOfDocs, name, lastModified }, i) => (
												<Card
													key={i}
													id={id}
													dateModified={lastModified}
													displayName={name}
													numberOfPages={numberOfDocs}
													goForwardTo={goForwardTo}
												/>
											))}
										</CardContainer>
										<CardContainer
											items={userDocs?.docs.filter((d) => d.id !== '_sub_folders_')}
											forDocuments>
											{userDocs?.docs.map((d, i) => {
												if (d.id !== '_sub_folders_')
													return (
														<Card
															goForwardTo={goForwardTo}
															id={d.data().id}
															key={i}
															displayName={d.data().name}
															numberOfPages={d.data().numberOfPages}
															dateModified={d.data().dateModified}
															forDocuments
														/>
													)
											})}
										</CardContainer>
									</PathContext.Provider>
								</UserContext.Provider>
							</div>
						</>
					)}
				</Loading>
			</main>
		</>
	)
}
