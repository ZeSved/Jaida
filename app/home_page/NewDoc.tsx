'use client'

import { auth, db } from '@/firebase/firebase'
import newDocSVG from '@/public/Create new file.svg'
import { User, onAuthStateChanged } from 'firebase/auth'
import { collection, doc, setDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useState } from 'react'

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
			onClick={async () => {
				try {
					const userDocument = doc(db, 'users', currentUser!.uid)
					const userDocs = collection(userDocument, 'user-documents')
					const new_doc = doc(userDocs, 'DOC-1')

					const docPages = collection(new_doc, 'pages')
					const docContent = doc(docPages, 'PAGE-1')

					await setDoc(new_doc, {
						name: 'DOC-1',
						numberOfPages: 1,
					})

					await setDoc(docContent, {
						name: 'PAGE-1',
						content: '',
					})

					await router.push(`/m/DOC-1`)
				} catch (e) {
					throw new Error(`The following error has occured: ${e}`)
				}
			}}>
			<img
				src={newDocSVG}
				alt=''
			/>
		</button>
	)
}
