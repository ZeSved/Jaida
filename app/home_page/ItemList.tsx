'use client'

import { DocumentData, QuerySnapshot } from 'firebase/firestore'
import Link from 'next/link'
import MDocCard from './card'
import { useAuthState } from '../hooks/useAuthState'
import s from '@/app/@children/page.module.scss'
import Image from 'next/image'
import plus from '@/public/Vector 15.svg'
import { createNewDocument } from '../utils/createNewDocument'
import { useRouter } from 'next/navigation'

export default function ItemList({
	items,
	forDocuments = false,
}: {
	items: QuerySnapshot<DocumentData, DocumentData>
	forDocuments?: boolean
}) {
	const user = useAuthState()
	const router = useRouter()

	return (
		<div className={s.list}>
			<div className={s.info}>
				<button
					title='New folder'
					onClick={() => createNewDocument(user!, router)}>
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
			{items.docs.length >= 1 ? (
				<div className={s.cardContainer}>
					{items.docs.map((d, i) => (
						<MDocCard
							id={d.data().name}
							key={i}
							displayName={d.data().displayName}
							currentUser={user!}
							numberOfPages={d.data().numberOfPages}
							dateModified={d.data().dateModified}
							forDocuments={forDocuments}
						/>
					))}
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
			) : (
				<h2>Nothing to see here ¯\_(ツ)_/¯</h2>
			)}
		</div>
	)
}
