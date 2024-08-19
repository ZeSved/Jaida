'use client'

import { db } from '@/firebase/firebase'
import { User } from 'firebase/auth'
import { DocumentData, DocumentReference, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import s from '@/app/@children/page.module.scss'
import Image from 'next/image'
// import new_image from '@/public/Create new file.svg'

export default function NewDoc({ currentUser }: { currentUser: User }) {
	const router = useRouter()

	function createNewDocMetadata() {
		const id = crypto.randomUUID()

		const userDocument = doc(db, 'users', currentUser!.uid, 'user-documents', `DOC-${id}`)
		const docContent = doc(userDocument, 'pages', 'PAGE-1')

		router.push(`/m/DOC-${id}`)

		createNewDoc(userDocument, id, docContent)
	}

	async function createNewDoc(
		userDocument: DocumentReference<DocumentData, DocumentData>,
		id: string,
		docContent: DocumentReference<DocumentData, DocumentData>
	) {
		// const amountOfDocs =
		// 	(await getDocs(collection(db, 'users', currentUser!.uid, 'user-documents'))).size + 1

		if (!window.location.pathname.includes(`m`))
			setTimeout(() => createNewDoc(userDocument, id, docContent), 100)

		await setDoc(userDocument, {
			name: `DOC-${id}`,
			displayName: 'untitled',
			numberOfPages: 1,
			dateOfCreation: new Date(),
		})

		await setDoc(docContent, {
			name: 'PAGE-1',
			content: [''],
		})

		await updateDoc(doc(db, 'users', currentUser.uid), {
			numberOfDocuments: ((
				await getDoc(doc(db, 'users', currentUser.uid))
			).data()!.numberOfDocuments += 1),
		})
	}

	return (
		<button
			onClick={createNewDocMetadata}
			className={s.newDocument}>
			{/* <Image
				src={new_image}
				height={100}
				width={100}
				alt=''
			/> */}
		</button>
	)
}
