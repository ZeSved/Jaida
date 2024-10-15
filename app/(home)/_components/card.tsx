'use client'

import Link from 'next/link'
import Image from 'next/image'
import s from '../page.module.scss'
import doc_img from '@/public/document.svg'
import { User } from 'firebase/auth'
import { db } from '@/db/firebase'
import { getDocs, collection, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore'
import { useContext, useEffect, useRef, useState } from 'react'
import folder from '@/public/folder.svg'
import option from '@/public/options.svg'
import { useDirectory } from '@/hooks/useDirectory'
import { PathContext, UserContext } from '../page'

export default function Card({
	id,
	displayName,
	numberOfPages,
	dateModified,
	forDocuments = false,
	goForwardTo,
}: CardProps) {
	const [open, setOpen] = useState<boolean>(false)
	const [winWidth, setWinWidth] = useState<boolean>(false)
	const buttonRef = useRef<HTMLButtonElement>(null)
	const user = useContext(UserContext)
	const path = useContext(PathContext)

	const buttons = [
		{
			display: 'Rename',
			func: async (e: any) => {
				e.preventDefault()
				e.stopPropagation()

				const text = prompt('new name:')!

				console.log(id.substring(2))

				const data = await getDoc(doc(db, path.join('/'), '_sub_folders_'))

				if (forDocuments) {
					await updateDoc(doc(db, path.join('/'), id), {
						name: text,
					})
				} else {
					await updateDoc(doc(db, path.join('/'), '_sub_folders_'), {
						[id.substring(2)]: {
							...data.data()![id.substring(2)],
							name: text,
						},
					})
				}

				setOpen(false)
			},
		},
		{
			display: 'Delete',
			func: async (e: any) => {
				e.preventDefault()

				const docs = await getDocs(
					collection(db, 'users', user!.uid, 'user-documents', id, 'pages')
				)

				docs.forEach(async (d) => {
					await deleteDoc(doc(db, 'users', user!.uid, 'user-documents', id, 'pages', d.data().name))
				})

				await deleteDoc(doc(db, 'users', user!.uid, 'user-documents', id))

				await updateDoc(doc(db, 'users', user!.uid), {
					numberOfDocuments: ((
						await getDoc(doc(db, 'users', user!.uid))
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
		window.addEventListener('resize', windowToSmall)

		return () => {
			document.removeEventListener('mousedown', clickedOutside)
			window.removeEventListener('resize', windowToSmall)
		}
	}, [])

	return forDocuments ? (
		<Link
			href={`../../editor/${id}`}
			// onClick={() => {
			// 	goForwardTo(id)
			// }}
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
							onClick={(e) => b.func(e)}
							key={i}>
							{b.display}
						</button>
					))}
				</div>
			</div>
		</Link>
	) : (
		<div
			onClick={() => {
				goForwardTo(id)
				// console.log(path)
			}}
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
							onClick={(e) => b.func(e)}
							key={i}>
							{b.display}
						</button>
					))}
				</div>
			</div>
		</div>
	)
}

type CardProps = {
	id: string
	displayName: string
	numberOfPages: number
	dateModified: string
	forDocuments?: boolean
	goForwardTo: (newPath: string) => string
}
