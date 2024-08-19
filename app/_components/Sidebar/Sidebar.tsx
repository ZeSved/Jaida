'use client'

import s from './Sidebar.module.scss'
import Image from 'next/image'
import doc_create from '@/public/Doc create 3.svg'
import folder_create from '@/public/Folder create 2.svg'
import persp from '@/public/Perspectives.svg'
import time_sort from '@/public/Sort by time.svg'
import title_sort from '@/public/Sort by title.svg'
import NewDoc from '@/app/home_page/NewDoc'
import { createNewDocument } from '@/app/utils/createNewDocument'
import { User } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export default function Sidebar({ currentUser }: { currentUser: User }) {
	const router = useRouter()

	const buttons = [
		{
			display: doc_create,
			func: () => createNewDocument(currentUser, router),
			text: 'Create new document',
		},
		{
			display: folder_create,
			text: 'Create new folder',
		},
		{
			display: time_sort,
			text: 'Sort documents by date',
		},
		{
			display: title_sort,
			text: 'Sort documents by name',
		},
		{
			display: persp,
			text: 'Change document layout',
		},
	]

	return (
		<div className={s.wrapper}>
			{buttons.map((b, i) => (
				<button
					data-length={b.text.length}
					data-text={b.text}
					key={i}
					onClick={b.func}>
					<Image
						src={b.display}
						alt=''
					/>
				</button>
			))}
		</div>
	)
}
