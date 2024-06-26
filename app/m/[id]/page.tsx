'use client'
import { CSSProperties, useEffect, useState } from 'react'
import s from './m-d-editor.module.scss'
import Settings from './settings/Settings'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '@/firebase/firebase'
import { doc, getDoc, DocumentSnapshot, DocumentData, DocumentReference } from 'firebase/firestore'
import { LoadingSq } from '@/components/loading/loadingSquare'
import Editor from './Editor'

// function reducer(rep: typeof replacements, action: Action) {
// 	return {
// 		...rep,
// 		[action.type as Replacements]: action.payload,
// 	}
// }

// type Action = {
// 	type: `${Replacements}`
// 	payload: {
// 		active: boolean
// 		options: [{ text: string; active: boolean }, { text: string; active: boolean }]
// 	}
// }

export default function MarkdownEditor() {
	// const [rep, dispatch] = useReducer(reducer, replacements)
	const [bg, setBg] = useState<CSSProperties>({ background: '1a1a1a' })
	const [currentDoc, setCurrentDoc] = useState<
		DocumentSnapshot<DocumentData, DocumentData> | undefined
	>()
	const [currentDocPages, setCurrentDocPages] = useState<
		DocumentSnapshot<DocumentData, DocumentData> | undefined
	>()
	const [currentDocumentReference, setCurrentDocumentReference] =
		useState<DocumentReference<DocumentData, DocumentData>>()
	const [currentUser, setCurrentUser] = useState<User | undefined>()

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (user) => {
			if (user) {
				setCurrentUser(user)
			} else {
				setCurrentUser(undefined)
			}
		})

		return () => unsub()
	}, [])

	useEffect(() => {
		if (currentUser) getDocuments()

		async function getDocuments() {
			const currentDocRef = doc(
				db,
				'users',
				currentUser!.uid,
				'user-documents',
				window.location.href.split('/m/')[1]
			)
			setCurrentDocumentReference(currentDocRef)

			await getDoc(currentDocRef).then((docs) => {
				setCurrentDoc(docs)
			})

			await getDoc(doc(currentDocRef, 'pages', 'PAGE-1')).then((pages) => {
				setCurrentDocPages(pages)
			})
		}
	}, [currentUser])

	return (
		<>
			<title>{currentDoc ? `Jaida - ${currentDoc.data()?.displayName}` : 'Jaida'}</title>
			<main className={s.main}>
				<Settings
					setBg={setBg}
					bg={bg}
				/>
				<div className={s.container}>
					<div className={s.editor}>
						{currentDoc ? (
							<Editor
								currentDocPages={currentDocPages}
								currentDocumentReference={currentDocumentReference}
							/>
						) : (
							<LoadingSq />
						)}
					</div>
				</div>
			</main>
		</>
	)
}

type Replacements =
	| 'alpha'
	| 'beta'
	| 'gamma'
	| 'delta'
	| 'epsilon'
	| 'zeta'
	| 'eta'
	| 'theta'
	| 'iota'
	| 'kappa'
	| 'lambda'
	| 'mu'
	| 'nu'
	| 'xi'
	| 'omicron'
	| 'pi'
	| 'rho'
	| 'sigma'
	| 'tau'
	| 'upsilon'
	| 'phi'
	| 'chi'
	| 'psi'
	| 'omega'
