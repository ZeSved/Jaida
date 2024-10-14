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

export default function ItemList({
	items,
	forDocuments = false,
	path,
	children,
}: {
	items: Folder[] | DocumentSnapshot<DocumentData, DocumentData>[] | undefined
	children: React.ReactNode
	path: string[]
	forDocuments?: boolean
}) {
	const user = useAuthState()
	const router = useRouter()

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
				<Loading condition={!items}>
					{items && (
						<>
							{items.length === 0 && <h2>Nothing to see here ¯\_(ツ)_/¯</h2>}

							{items.length >= 1 && children}
							{/* {children} */}
						</>
					)}
				</Loading>
			</div>
		</div>
	)
}
