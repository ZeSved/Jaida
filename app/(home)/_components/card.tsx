'use client'

import Link from 'next/link'
import Image from 'next/image'
import s from '../page.module.scss'
import doc_img from '@/public/document.svg'
import { db } from '@/db/firebase'
import { getDocs, collection, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore'
import { useContext, useEffect, useRef, useState } from 'react'
import folder from '@/public/folder.svg'
import option from '@/public/options.svg'
import { PathContext, UserContext } from '@/constants/contexts'

export default function Card({
	id,
	displayName,
	numberOfPages,
	dateModified,
	forDocuments = false,
	numberOfFolders,
	goForwardTo,
}: CardProps) {
	const [open, setOpen] = useState<boolean>(false)
	const [winWidth, setWinWidth] = useState<boolean>(false)
	const buttonRef = useRef<HTMLButtonElement>(null)
	const user = useContext(UserContext)
	const path = useContext(PathContext)

	const info = [
		{ text: ['Last modified', dateModified] },
		{ text: [forDocuments ? 'Pages' : 'Documents', numberOfPages] },
		{ cond: !forDocuments, text: ['Folders', numberOfFolders] },
	]

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
				e.stopProbagation()

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
		function clickedOutside(e: MouseEvent) {
			if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
				setOpen(false)
			}
		}

		document.addEventListener('mousedown', clickedOutside)

		return () => {
			document.removeEventListener('mousedown', clickedOutside)
		}
	}, [])

	return (
		<Wrapper
			id={id}
			type={forDocuments ? 'link' : 'folder'}
			goForwardTo={goForwardTo}>
			<Image
				src={forDocuments ? doc_img : folder}
				alt=''
				used-for-docs={forDocuments ? 'true' : undefined}
			/>
			<p>{displayName}</p>
			<button
				ref={buttonRef}
				onClick={(e) => {
					e.preventDefault()
					e.stopPropagation()
					setOpen(!open)
				}}>
				<Image
					src={option}
					alt=''
				/>
			</button>
			<div className={open ? s.popup : s.display}>
				{buttons.map((b, i) => (
					<button
						onClick={(e) => b.func(e)}
						key={i}>
						{b.display}
					</button>
				))}
				<div className={s.divider} />
				{info.map((inf, i) => (
					<>
						{(inf.cond || inf.cond === undefined) && (
							<>
								<p key={i}>
									<span>{inf.text[0]}:</span> <span>{inf.text[1]}</span>
								</p>
								{i !== info.length - 1 && <div />}
							</>
						)}
					</>
				))}
			</div>
		</Wrapper>
	)
}

function Wrapper({
	type,
	id,
	children,
	goForwardTo,
}: {
	type: string
	id: string
	children: React.ReactNode
	goForwardTo?: (newPath: string) => string
}) {
	return type === 'link' ? (
		<Link
			href={`../../editor/${id}`}
			className={s.card}
			id={id}>
			{children}
		</Link>
	) : (
		<div
			onClick={() => {
				goForwardTo!(id)
			}}
			className={s.card}
			id={id}>
			{children}
		</div>
	)
}

type CardProps = {
	id: string
	displayName: string
	numberOfPages: number
	dateModified: string
	forDocuments?: boolean
	numberOfFolders?: number
	goForwardTo: (newPath: string) => string
}
