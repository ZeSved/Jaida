'use client'
import { CSSProperties, createElement, useEffect, useReducer, useRef, useState } from 'react'
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
import { LoadingSq } from '@/components/loadingSquare'

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
	const [currentRow, setCurrentRow] = useState<number>(0)
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

	function newRange(arg?: 'initial' | 'enter') {
		if (window.getSelection()) {
			const range = document.createRange()
			const selection = window.getSelection()!

			const newRow = ref.current!.childNodes.length - 1

			if (arg === 'enter') {
				setCurrentRow(newRow)
			}

			const elem = selection.focusNode!.childNodes[newRow]
			// selection.focusNode!.childNodes[
			// 	arg === 'initial' ? 0 : arg === 'enter' ? newRow + 1 : newRow
			// ]
			range.setStart(elem, 1)
			range.collapse(true)

			selection!.removeAllRanges()
			selection!.addRange(range)
			ref.current!.focus()
		}
	}

	function handleKeyboard(e: Event & KeyboardEvent) {
		if (currentDocumentReference) {
			setTimeout(async () => {
				await updateDoc(doc(currentDocumentReference, 'pages', 'PAGE-1'), {
					content: parser({ action: 'POST-DB', content: ref.current!.innerHTML }),
				})
			}, 10)
		}

		if (/^[a-zA-Z]$/.test(e.key) && !ref.current!.hasChildNodes()) {
			e.preventDefault()
			ref.current!.innerHTML += `<div id='row-${ref.current!.childNodes.length}'>${e.key}</div>`

			if (ref.current!.childNodes.length === 0) {
				newRange('initial')
			}
		}

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

			newRange()
		}

		if (e.key === 'Enter') {
			e.preventDefault()
			ref.current!.innerHTML += `<div id='row-${ref.current!.childNodes.length}'>${'\n'}</div>`
			newRange('enter')
		}

		if (
			e.key === 'Backspace' &&
			ref.current!.childNodes[1] === undefined &&
			ref.current!.childNodes[0].textContent?.length === 0
		) {
			e.preventDefault()
		}

		if (e.key === 'ArrowUp') {
			if (currentRow > 0) {
				const newRow = currentRow - 1
				setCurrentRow(newRow)
			}
		}
	}

	useEffect(() => {
		if (currentDocPages) {
			const loadedDocContent = parser({
				content: currentDocPages.data()?.content,
				action: 'GET-DB',
			}) as string
			// ref.current!.innerHTML = (parser(currentDocPages.data()?.content, 'GET-DB')) ?? ''
			ref.current!.innerHTML =
				loadedDocContent.length === 0
					? `<div id='row-${ref.current!.childNodes.length}'></div>`
					: loadedDocContent
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
						{currentDoc ? (
							<div
								ref={ref}
								style={bg}
								id='editor'
								className={s.docEdit}
								contentEditable></div>
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
