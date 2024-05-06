'use client'

import { db } from '@/firebase/firebase'
import { User } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import s from '@/app/page.module.scss'
import Image from 'next/image'
import new_image from '@/public/Create new file.svg'

export default function NewDoc({ currentUser }: { currentUser: User }) {
	const router = useRouter()

	return (
		<button
			onClick={async () => {
				// const amountOfDocs =
				// 	(await getDocs(collection(db, 'users', currentUser!.uid, 'user-documents'))).size + 1
				const id = crypto.randomUUID()

				const userDocument = doc(db, 'users', currentUser!.uid, 'user-documents', `DOC-${id}`)
				const docContent = doc(userDocument, 'pages', 'PAGE-1')

				router.push(`/m/DOC-${id}`)

				await setDoc(userDocument, {
					name: `DOC-${id}`,
					displayName: 'untitled',
					numberOfPages: 1,
					dateOfCreation: new Date(),
				})

				await setDoc(docContent, {
					name: 'PAGE-1',
					content: '',
				})

				await updateDoc(doc(db, 'users', currentUser.uid), {
					numberOfDocuments: ((
						await getDoc(doc(db, 'users', currentUser.uid))
					).data()!.numberOfDocuments += 1),
				})
			}}
			className={s.newDocument}>
			<Image
				src={new_image}
				height={100}
				width={100}
				alt=''
			/>
		</button>
	)
}
