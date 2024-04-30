'use client'

import { auth, db } from '@/firebase/firebase'
import newDocSVG from '@/public/Create new file.svg'
import { User, onAuthStateChanged } from 'firebase/auth'
import { collection, doc, setDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import s from '@/app/page.module.scss'
import Image from 'next/image'

export default function NewDoc() {
	const [currentUser, setCurrentUser] = useState<User | undefined>()
	const router = useRouter()

	onAuthStateChanged(auth, (user) => {
		if (user) {
			setCurrentUser(user)
		} else {
			setCurrentUser(undefined)
		}
	})

	return (
		<button
			onClick={() => {
				if (currentUser) createDoc()

				async function createDoc() {
					try {
						const userDocument = doc(db, 'users', currentUser!.uid, 'user-documents', 'DOC-1')
						// const userDocs = collection(userDocument, 'user-documents')
						// const new_doc = doc(userDocs, 'DOC-1')

						// const docPages = collection(userDocument, 'pages')
						const docContent = doc(userDocument, 'pages', 'PAGE-1')

						await setDoc(userDocument, {
							name: 'DOC-1',
							numberOfPages: 1,
						})

						await setDoc(docContent, {
							name: 'PAGE-1',
							content: '',
						})

						router.push(`/m/DOC-1`)
					} catch (e) {
						throw new Error(`The following error has occured: ${e}`)
					}
				}
			}}
			className={s.new}>
			<Image
				src={newDocSVG}
				height={100}
				width={100}
				alt=''
			/>
		</button>
	)
}
