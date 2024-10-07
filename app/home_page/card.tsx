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
import option from '@/public/options.svg'

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
	const [winWidth, setWinWidth] = useState<boolean>(false)
	const buttonRef = useRef<HTMLButtonElement>(null)

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
		const windowWidth = window.innerWidth < 990
		setWinWidth(windowWidth)

		function clickedOutside(e: MouseEvent) {
			if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
				setOpen(false)
			}
		}

		function windowToSmall() {
			const winWidth = window.innerWidth < 990

			setWinWidth(winWidth)
		}

		document.addEventListener('mousedown', clickedOutside)
		document.addEventListener('resize', windowToSmall)

		return () => {
			document.removeEventListener('mousedown', clickedOutside)
			document.removeEventListener('resize', windowToSmall)
		}
	}, [])

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
				<button
					ref={buttonRef}
					onClick={() => setOpen(!open)}>
					<Image
						src={option}
						alt=''
					/>
				</button>
				<div style={{ display: winWidth ? (open ? 'flex' : 'none') : 'flex' }}>
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
