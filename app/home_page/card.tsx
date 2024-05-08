'use client'

import Link from 'next/link'
import Image from 'next/image'
import Jaida_small_logo from '@/public/Jaida Logo.svg'
import s from '@/app/@children/page.module.scss'
import options from '@/public/options.svg'
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
			<div className={s.cardContent}>
				<Link
					className={s.cardLink}
					href={`/m/${id}`}>
					<Image
						src={Jaida_small_logo}
						alt='Jadia small logo'
					/>
				</Link>
				<div className={s.cardMenu}>
					<p className={s.cardName}>{displayName}</p>
					<button
						className={s.cardOpenSettings}
						onClick={() => setOpen(!open)}>
						<Image
							alt='options'
							src={options}
						/>
					</button>
				</div>
			</div>
			<div className={classNames(s.cardSettings, !open && s.hide)}>
				<div className={s.divider} />
				<div className={s.cardButtons}>
					{buttons.map((b, i) => (
						<>
							{i !== 0 && <div className={s.subDivider} />}
							<button
								className={s.cardButton}
								key={i}
								onClick={b.func}>
								{b.display}
							</button>
						</>
					))}
				</div>
			</div>
		</div>
	)
}
