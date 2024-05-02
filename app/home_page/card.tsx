'use client'

import Link from 'next/link'
import Image from 'next/image'
import Jaida_small_logo from '@/public/Jaida Logo.svg'
import s from '@/app/page.module.scss'
import options from '@/public/options.svg'
import { User } from 'firebase/auth'
import { db } from '@/firebase/firebase'
import { getDocs, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore'

export default function MDocCard({
	name,
	id,
	currentUser,
	displayName,
}: {
	name: string
	id: string
	currentUser: User
	displayName: string
}) {
	return (
		<div id={id}>
			<Link
				className={s.card}
				href={`/m/${id}`}>
				<Image
					src={Jaida_small_logo}
					alt='Jadia small logo'
				/>
			</Link>
			<div>
				<p>{displayName}</p>
				<button
					onClick={async () => {
						const docs = await getDocs(
							collection(db, 'users', currentUser.uid, 'user-documents', id, 'pages')
						)

						docs.forEach(async (d) => {
							await deleteDoc(
								doc(db, 'users', currentUser.uid, 'user-documents', id, 'pages', d.data().name)
							)
						})

						await deleteDoc(doc(db, 'users', currentUser.uid, 'user-documents', id))
					}}>
					<Image
						alt='options'
						src={options}
					/>
				</button>
				<button
					onClick={async () => {
						await updateDoc(doc(db, 'users', currentUser.uid, 'user-documents', id), {
							displayName: prompt('new name:')!,
						})
					}}>
					R
				</button>
			</div>
		</div>
	)
}
