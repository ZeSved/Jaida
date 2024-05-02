import styles from './page.module.scss'
import MDocCard from './home_page/card'
import Header from './_components/Header/page'
import NewDoc from './home_page/NewDoc'
import { auth, db } from '@/firebase/firebase'
import { DocumentData, QuerySnapshot, collection, getDocs } from 'firebase/firestore'
import { User, onAuthStateChanged } from 'firebase/auth'
import React, { Suspense, useEffect, useState } from 'react'
import Login from './_components/Header/login'
import classNames from 'classnames'
import Loading from './loading'

export default async function Home() {
	onAuthStateChanged(auth, async (user) => {
		if (user) {
			const docs = await getDocs(collection(db, 'users', user!.uid, 'user-documents'))

			if (docs && docs.size === 0) {
				return (
					<Wrapper
						user={user}
						docs={docs}>
						<h4>Oops, looks like you don't have any documents...</h4>
						<NewDoc currentUser={user} />
					</Wrapper>
				)
			}

			return (
				<Wrapper
					user={user}
					docs={docs}>
					<Suspense fallback={<Loading />}>
						{docs.docs.map((d) => (
							<MDocCard
								id={d.data().name}
								name={d.data().name}
								key={d.data().id}
							/>
						))}
					</Suspense>
					<NewDoc currentUser={user} />
				</Wrapper>
			)
		} else {
			return (
				<Wrapper>
					<h2>Sign in to continue</h2>
					<Login />
				</Wrapper>
			)
		}
	})
}

function Wrapper({
	children,
	user,
	docs,
}: {
	children: React.ReactNode
	user?: User | undefined
	docs?: QuerySnapshot<DocumentData, DocumentData> | undefined
}) {
	return (
		<>
			<Header />
			<main className={styles.container}>
				<div
					className={classNames(
						styles.main,
						!user && styles.noUser,
						docs && docs?.size < 1 && styles.noDocs
					)}>
					{children}
				</div>
			</main>
		</>
	)
}
