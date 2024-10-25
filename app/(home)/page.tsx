'use client'

import { collection, doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '@/db/firebase'
import Login from '@/components/Login/login'
import Header from '@/app/_components/Header/page'
import CardContainer from './_components/CardContainer'
import { useAuthState } from '@/hooks/useAuthState'
import styles from './page.module.scss'
import { useDirectory } from '@/hooks/useDirectory'
import Loading from '@/components/loading/Loading'
import Card from './_components/card'
import { Folder, Snapshot } from '@/db/types'
import Directory from './_components/Directory'
import NotFound from './_components/_NotFound/NotFound'
import { PathContext, UserContext } from '@/constants/contexts'

export default function HomePage() {
	const user = useAuthState()
	const [userDocs, setUserDocs] = useState<Snapshot | undefined>(undefined)
	const [userFolders, setUserFolders] = useState<Folder[] | undefined>(undefined)
	const [folders, setFolders] = useState<{ id: string; name: string }[]>([
		{ name: 'Home', id: 'user-documents' },
	])
	const { path, goForwardTo, goBackTo } = useDirectory(user)
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

					// console.log(path)
					for (const f in queryResult.data()) {
						const folder = queryResult.data()![f]

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
			setUserFolders(undefined)
		}
	}, [user, path])

	useEffect(() => {
		if (!userFolders) return
		const filteredPath = path.filter((p) => p !== '_sub_folders_')

		if (
			folders.length > filteredPath.length - 2 &&
			folders.length >= 1 &&
			filteredPath.length >= 1
		) {
			folders.splice(filteredPath.length - 2, folders.length - 1 - (filteredPath.length - 3))
			setFolders([...folders])
		} else {
			userFolders!.forEach((folder) => {
				const lastItem = filteredPath[filteredPath.length - 1]

				if (lastItem === folder.id) {
					setFolders([...folders, { name: folder.name, id: folder.id }])
				}
			})
		}
	}, [userFolders, path])

	return (
		<>
			<Header />
			<main className={styles.container}>
				<Loading condition={user === null}>
					<NotFound
						message={{
							text: 'Sign in/up to continue',
							condition: user === undefined,
							action: <Login onlyButton />,
						}}
					/>

					{user && (
						<PathContext.Provider value={path}>
							<Directory
								folders={folders}
								goBackTo={goBackTo}
							/>

							<div className={styles.main}>
								<UserContext.Provider value={user}>
									<CardContainer items={userFolders}>
										{userFolders?.map(
											({ id, numberOfDocs, name, lastModified, numberOfFolders }, i) => (
												<Card
													key={i}
													id={id}
													dateModified={lastModified}
													displayName={name}
													numberOfPages={numberOfDocs}
													numberOfFolders={numberOfFolders}
													goForwardTo={goForwardTo}
												/>
											)
										)}
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
								</UserContext.Provider>
							</div>
						</PathContext.Provider>
					)}
				</Loading>
			</main>
		</>
	)
}
