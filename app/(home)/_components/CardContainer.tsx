'use client'

import {
	doc,
	DocumentData,
	DocumentSnapshot,
	getDoc,
	QueryDocumentSnapshot,
	QuerySnapshot,
	setDoc,
	updateDoc,
} from 'firebase/firestore'
import Link from 'next/link'
import Card from './card'
import { useAuthState } from '@/hooks/useAuthState'
import s from '../page.module.scss'
import Image from 'next/image'
import plus from '@/public/plus.svg'
import { createDocument, createFolder } from '@/db/utils/create'
import { useRouter } from 'next/navigation'
import Loading from '@/components/loading/Loading'
import { db } from '@/db/firebase'
import ShortUniqueId from 'short-unique-id'
import { Folder } from '@/db/types'
import { useDirectory } from '@/hooks/useDirectory'
import { useContext } from 'react'
import { PathContext, UserContext } from '../page'
import NotFound from './_NotFound/NotFound'

export default function CardContainer({
	items,
	forDocuments = false,
	// path,
	children,
}: {
	items: Folder[] | DocumentSnapshot<DocumentData, DocumentData>[] | undefined
	children: React.ReactNode
	// path: string[]
	forDocuments?: boolean
}) {
	const router = useRouter()
	const user = useContext(UserContext)
	const path = useContext(PathContext)

	return (
		<div className={s.list}>
			<div className={s.info}>
				<button
					title={forDocuments ? 'New Document' : 'New Folder'}
					onClick={forDocuments ? () => createDocument(user!, router) : () => createFolder(path)}>
					<Image
						src={plus}
						alt=''
					/>
				</button>
				<div className={s.text}>
					<p>Name</p>
					<p>Last Modified</p>
					<p>{forDocuments ? 'Pages' : 'Documents'}</p>
					<p>Actions</p>
				</div>
			</div>
			<div className={s.cardContainer}>
				<Loading condition={items === undefined}>
					{items && (
						<>
							<NotFound
								message={{
									text: 'Nothing to see here ¯\\_(ツ)_/¯',
									condition: items.length === 0,
								}}
							/>

							{items.length >= 1 && children}
						</>
					)}
				</Loading>
			</div>
		</div>
	)
}
