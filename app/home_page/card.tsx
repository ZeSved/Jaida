'use client'

import Link from 'next/link'
import Image from 'next/image'
import s from '@/app/@children/page.module.scss'
import options from '@/public/Options.svg'
import doc_img from '@/public/Doc 4.svg'
import { User } from 'firebase/auth'
import { db } from '@/firebase/firebase'
import { getDocs, collection, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore'
import { useState } from 'react'
import classNames from 'classnames'

export default function MDocCard({
	id,
	currentUser,
	displayName,
}: {
	id: string
	currentUser: User
	displayName: string
}) {
	const [open, setOpen] = useState<boolean>(false)

	const buttons = [
		{
			display: 'Rename',
			func: async () => {
				await updateDoc(doc(db, 'users', currentUser.uid, 'user-documents', id), {
					displayName: prompt('new name:')!,
				})
			},
		},
		{
			display: 'Delete',
			func: async () => {
				const docs = await getDocs(
					collection(db, 'users', currentUser.uid, 'user-documents', id, 'pages')
				)

				docs.forEach(async (d) => {
					await deleteDoc(
						doc(db, 'users', currentUser.uid, 'user-documents', id, 'pages', d.data().name)
					)
				})

				await deleteDoc(doc(db, 'users', currentUser.uid, 'user-documents', id))

				await updateDoc(doc(db, 'users', currentUser.uid), {
					numberOfDocuments: ((
						await getDoc(doc(db, 'users', currentUser.uid))
					).data()!.numberOfDocuments -= 1),
				})
			},
		},
	]

	return (
		<div
			className={s.card}
			id={id}>
			<Link
				className={s.cardLink}
				href={`/m/${id}`}>
				<div className={s.img}>
					<Image
						alt=''
						src={doc_img}
					/>
				</div>
				<div className={s.info}>
					<p>{displayName}</p>
					<button>
						<Image
							alt=''
							src={options}
						/>
					</button>
				</div>
			</Link>
		</div>
	)
}
