'use client'

import Link from 'next/link'
import Image from 'next/image'
import s from '@/app/@children/page.module.scss'
import doc_img from '@/public/Vector 6.svg'
import { User } from 'firebase/auth'
import { db } from '@/firebase/firebase'
import { getDocs, collection, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore'
import { useEffect, useRef, useState } from 'react'
import folder from '@/public/Rectangle 54.svg'

export default function MDocCard({
	id,
	currentUser,
	displayName,
	numberOfPages,
	dateModified,
	forDocuments = false,
}: {
	id: string
	currentUser: User
	displayName: string
	numberOfPages: number
	dateModified: string
	forDocuments?: boolean
}) {
	const [open, setOpen] = useState<boolean>(false)
	const [location, setLocation] = useState<number[]>([])

	const buttons = [
		{
			display: 'Rename',
			func: async () => {
				await updateDoc(doc(db, 'users', currentUser.uid, 'user-documents', id), {
					displayName: prompt('new name:')!,
				})

				setOpen(false)
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

				setOpen(false)
			},
		},
	]

	// useEffect(() => {
	// 	function clickedOutside(e: MouseEvent) {
	// 		if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
	// 			setOpen(false)
	// 		}
	// 	}

	// 	document.addEventListener('mousedown', clickedOutside)

	// 	return () => document.removeEventListener('mousedown', clickedOutside)
	// }, [])

	return (
		<div
			className={s.card}
			id={id}>
			<Image
				src={forDocuments ? doc_img : folder}
				alt=''
				used-for-docs={forDocuments ? 'true' : undefined}
			/>
			<div>
				<p>{displayName}</p>
				<p>{dateModified}</p>
				<p>{numberOfPages}</p>
				<div>
					{buttons.map((b, i) => (
						<button
							onClick={b.func}
							key={i}>
							{b.display}
						</button>
					))}
				</div>
			</div>
		</div>
	)
}
