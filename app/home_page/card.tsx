'use client'

import Link from 'next/link'
import Image from 'next/image'
import s from '@/app/@children/page.module.scss'
import options from '@/public/Options.svg'
import doc_img from '@/public/Doc 4.svg'
import { User } from 'firebase/auth'
import { db } from '@/firebase/firebase'
import { getDocs, collection, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore'
import { useEffect, useRef, useState } from 'react'
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
	const [location, setLocation] = useState<number[]>([])
	const dialogRef = useRef<HTMLDialogElement>(null)

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

	useEffect(() => {
		if (open) {
			dialogRef.current!.show()
		} else dialogRef.current!.close()
	}, [open])

	useEffect(() => {
		function clickedOutside(e: MouseEvent) {
			if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
				setOpen(false)
			}
		}

		document.addEventListener('mousedown', clickedOutside)

		return () => document.removeEventListener('mousedown', clickedOutside)
	}, [])

	return (
		<div
			className={s.card}
			id={id}>
			<Link href={`/m/${id}`}>
				<div className={s.img}>
					<Image
						alt=''
						src={doc_img}
					/>
				</div>
			</Link>
			<div className={s.info}>
				<Link href={`/m/${id}`}>
					<p>{displayName}</p>
				</Link>
				<button
					onClick={(e) => {
						setOpen(!open)
						setLocation([e.pageY + window.scrollY, e.pageX])
					}}>
					<Image
						alt=''
						src={options}
					/>
				</button>
				<dialog
					style={{ top: location[0], left: location[1] }}
					ref={dialogRef}>
					{buttons.map((b, i) => (
						<button
							onClick={b.func}
							key={i}>
							{b.display}
						</button>
					))}
				</dialog>
			</div>
		</div>
	)
}
