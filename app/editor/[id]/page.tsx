'use client'
import { CSSProperties, useEffect, useState } from 'react'
import s from './m-d-editor.module.scss'
import Settings from './_settings/Settings'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '@/db/firebase'
import { doc, getDoc, DocumentSnapshot, DocumentData, DocumentReference } from 'firebase/firestore'
import Loading from '@/components/loading/Loading'
import Editor from './_components/Editor'
import Results from './Results'

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
	const [currentText, setCurrentText] = useState<string>('')

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
				window.location.href.split('/editor/')[1]
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
			<title>{currentDoc ? `Jaida - ${currentDoc.data()?.name}` : 'Jaida'}</title>
			<main className={s.main}>
				<Settings
					setBg={setBg}
					bg={bg}
				/>
				<div className={s.container}>
					<div className={s.editor}>
						<Loading condition={!currentDoc}>
							<div>
								<Editor
									currentDocPages={currentDocPages}
									currentDocumentReference={currentDocumentReference}
									user={currentUser}
									currentDoc={currentDoc}
									currentText={currentText}
									setCurrentText={setCurrentText}
								/>
								<div className={s.div} />
								<Results
									currentText={currentText}
									currentDocPages={currentDocPages}
									setCurrentText={setCurrentText}
								/>
							</div>
						</Loading>
						{/* {currentDoc ? (
							<div>
								<Editor
									currentDocPages={currentDocPages}
									currentDocumentReference={currentDocumentReference}
									user={currentUser}
									currentDoc={currentDoc}
									currentText={currentText}
									setCurrentText={setCurrentText}
								/>
								<div className={s.div} />
								<Results currentText={currentText} />
							</div>
						) : (
							<LoadingSq />
						)} */}
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
