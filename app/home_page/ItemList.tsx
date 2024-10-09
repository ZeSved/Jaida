'use client'

import { doc, DocumentData, getDoc, QuerySnapshot, setDoc, updateDoc } from 'firebase/firestore'
import Link from 'next/link'
import MDocCard from './card'
import { useAuthState } from '../hooks/useAuthState'
import s from '@/app/page.module.scss'
import Image from 'next/image'
import plus from '@/public/plus.svg'
import { createDocument } from '../utils/createDocument'
import { useRouter } from 'next/navigation'
import { LoadingSq } from '@/components/loading/loadingSquare'
import { db } from '@/db/firebase'
import ShortUniqueId from 'short-unique-id'
import { database } from '@/db/api'

export default function ItemList({
	items,
	forDocuments = false,
}: {
	items: QuerySnapshot<DocumentData, DocumentData> | undefined
	forDocuments?: boolean
}) {
	const user = useAuthState()
	const router = useRouter()

	return (
		<div className={s.list}>
			<div className={s.info}>
				<button
					title={forDocuments ? 'New Document' : 'New Folder'}
					onClick={
						forDocuments
							? () => createDocument(user!, router)
							: async () => {
									const subFolderId = new ShortUniqueId({ length: 9 }).rnd()

									const newSubFolder = {
										id: subFolderId,
										numberOfDocs: 9,
										numberOfFolders: 3,
										name: 'test',
									}

									await setDoc(doc(db, 'users', user!.uid, 'user-documents', '_sub_folders_'), {
										[subFolderId]: newSubFolder,
									})
							  }
					}>
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

			{!items && <LoadingSq />}

			{items && items.docs.length === 0 && <h2>Nothing to see here ¯\_(ツ)_/¯</h2>}

			{items && items.docs.length >= 1 && (
				<div className={s.cardContainer}>
					{items.docs.map((d, i) => {
						if (d.id !== '_sub_folders_')
							return (
								<MDocCard
									id={d.data().name}
									key={i}
									displayName={d.data().displayName}
									currentUser={user!}
									numberOfPages={d.data().numberOfPages}
									dateModified={d.data().dateModified}
									forDocuments={forDocuments}
								/>
							)
					})}
					<MDocCard
						id={'test_card'}
						displayName={'Test'}
						currentUser={user!}
						dateModified='06/10/2024 23:10'
						numberOfPages={6}
						forDocuments={forDocuments}
					/>
					<MDocCard
						id={'test_card'}
						displayName={'Test'}
						currentUser={user!}
						dateModified='10/10/2014 21:50'
						numberOfPages={6}
						forDocuments={forDocuments}
					/>
					<MDocCard
						id={'test_card'}
						displayName={'Test'}
						currentUser={user!}
						dateModified='10/10/2014 21:50'
						numberOfPages={6}
						forDocuments={forDocuments}
					/>
					<MDocCard
						id={'test_card'}
						displayName={'Test'}
						currentUser={user!}
						dateModified='10/10/2014 21:50'
						numberOfPages={6}
						forDocuments={forDocuments}
					/>
				</div>
			)}
		</div>
	)
}
