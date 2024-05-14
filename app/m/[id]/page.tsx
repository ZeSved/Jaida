'use client'
import { CSSProperties, useEffect, useReducer, useRef, useState } from 'react'
import s from './m-d-editor.module.scss'
import Settings from './settings/Settings'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '@/firebase/firebase'
import {
	doc,
	getDoc,
	DocumentSnapshot,
	DocumentData,
	updateDoc,
	DocumentReference,
} from 'firebase/firestore'
import { replacements } from './replacements'
import { parser } from './parser'

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
	const ref = useRef<HTMLDivElement>(null)

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

	function setNewRange() {
		const range = document.createRange()
		const selection = window.getSelection()
		range.setStart(selection!.focusNode!, 1)
		range.collapse(true)

		selection?.removeAllRanges()
		selection?.addRange(range)
		ref.current!.focus()
	}

	function handleKeyboard(e: Event & KeyboardEvent) {
		if (currentDocumentReference) {
			setTimeout(async () => {
				await updateDoc(doc(currentDocumentReference, 'pages', 'PAGE-1'), {
					content: ref.current?.innerHTML,
				})
			}, 10)
		}

		console.log(parser('MD-HTML', ref.current?.textContent!))

		if (e.key === ' ') {
			for (let i = 0; i < replacements.length; i++) {
				const rep = replacements[i]

				if (!rep.active) continue
				const newString = ref.current!.innerHTML!.replace(
					new RegExp(rep.replaceWith, 'gi'),
					rep.options ? rep.options.find((t) => t.active === true)!.text : rep.option
				)
				ref.current!.innerHTML = newString
			}

			setNewRange()
		}

		if (e.key === 'Enter') {
			// e.preventDefault()
			// ref.current!.innerHTML += '<br>'
			setNewRange()
		}
	}

	useEffect(() => {
		if (currentDocPages) {
			ref.current!.innerHTML = currentDocPages.data()?.content ?? ''
		}

		window.addEventListener('keydown', handleKeyboard)

		return () => window.removeEventListener('keydown', handleKeyboard)
	}, [currentDocPages])

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
						<div
							ref={ref}
							style={bg}
							id='editor'
							contentEditable></div>
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
