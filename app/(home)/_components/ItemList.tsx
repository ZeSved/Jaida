'use client'

import { doc, DocumentData, getDoc, QuerySnapshot, setDoc, updateDoc } from 'firebase/firestore'
import Link from 'next/link'
import MDocCard from './card'
import { useAuthState } from '@/hooks/useAuthState'
import s from '../page.module.scss'
import Image from 'next/image'
import plus from '@/public/plus.svg'
import { createDocument, createFolder } from '@/db/utils/create'
import { useRouter } from 'next/navigation'
import Loading from '@/components/loading/Loading'
import { db } from '@/db/firebase'
import ShortUniqueId from 'short-unique-id'

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
					onClick={forDocuments ? () => createDocument(user!, router) : () => createFolder(user!)}>
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

			<Loading condition={!items}>
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
			</Loading>
		</div>
	)
}
