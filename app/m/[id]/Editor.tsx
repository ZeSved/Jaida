'use client'

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import s from './m-d-editor.module.scss'
import {
	updateDoc,
	doc,
	DocumentSnapshot,
	DocumentData,
	DocumentReference,
} from 'firebase/firestore'
// import { parser } from './utils/parser'
import { replacements } from './utils/replacements'
import { divId } from './utils/divId'
import { upload } from './utils/uploadFile'
import { User } from 'firebase/auth'
import { getBlob } from 'firebase/storage'
import { converter } from './utils/converter'
// import { Caret } from './utils/handleKeyboard'

export default function Editor({
	currentDocPages,
	currentDocumentReference,
	user,
	currentDoc,
	currentText,
	setCurrentText,
}: EditorProps) {
	const [currentRow, setCurrentRow] = useState<number>(0)
	const [action, setAction] = useState<Action>(undefined)
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (currentDocPages && ref) {
			// const loadedDocContent = parser({
			// 	content: currentDocPages.data()?.content,
			// 	action: 'GET-DB',
			// }) as string

			// ref.current!.innerHTML =
			// 	(parser({ action: 'GET-DB', content: currentDocPages.data()?.content }) as string) ?? ''
			// // ref.current!.append(loadedDocContent)

			ref.current!.textContent = currentDocPages.data()?.content
		}

		function handleKeyboardInit(e: Event & KeyboardEvent) {
			if (currentDocumentReference) {
				setTimeout(async () => {
					await updateDoc(doc(currentDocumentReference, 'pages', 'PAGE-1'), {
						content: ref.current?.textContent,
					})
				}, 10)
			}

			setTimeout(() => converter(ref.current?.textContent!, setCurrentText), 0)
			// if (/[^#*_\~`>\-\+=\|[\](){},!\\@:]+/.test(e.key)) {
			// }

			// handleKeyboard(e)
		}

		window.addEventListener('keydown', handleKeyboardInit)

		return () => window.removeEventListener('keydown', handleKeyboardInit)
	}, [currentDocPages, ref])

	// useEffect(() => {
	// 	console.log('works')
	// 	converter(ref.current!.textContent!, setCurrentText)
	// }, [ref.current?.textContent])

	// function handleKeyboard(e: Event & KeyboardEvent) {
	// 	// if (!ref) return

	// 	// if (/^[a-zA-Z]$/.test(e.key)) {
	// 	// 	if (ref.current!.childNodes.length === 1) {
	// 	// 		e.preventDefault()
	// 	// 		ref.current!.innerHTML += `<div><span><span>${e.key}</span></span></div>`
	// 	// 		setAction('initial')
	// 	// 		return
	// 	// 	}
	// 	// 	// if (!ref.current!.hasChildNodes()) {

	// 	// 	// }
	// 	// }

	// 	if (e.key === ' ') {
	// 		// for (let i = 0; i < replacements.length; i++) {
	// 		// 	const rep = replacements[i]

	// 		// 	if (!rep.active) continue
	// 		// 	const newString = ref.current!.innerHTML!.replace(
	// 		// 		new RegExp(rep.replaceWith, 'gi'),
	// 		// 		rep.options ? rep.options.find((t) => t.active === true)!.text : rep.option
	// 		// 	)
	// 		// 	ref.current!.innerHTML = newString
	// 		// }

	// 		// setAction('space')
	// 		e.preventDefault()
	// 		// Caret.space(ref, currentRow)
	// 	}

	// 	if (e.key === 'Enter') {
	// 		e.preventDefault()
	// 		// setCurrentRow(Caret.enter(ref, currentRow)!)
	// 	}

	// 	if (e.key === 'Backspace') {
	// 		// setTimeout(() => Caret.backspace(ref), 0)
	// 	}

	// 	if (e.key === 'ArrowUp') {
	// 		e.preventDefault()
	// 		setAction('up')
	// 	}

	// 	if (e.key === 'ArrowDown') {
	// 		e.preventDefault()
	// 		setAction('down')
	// 	}
	// }

	// useEffect(() => {
	// 	if (action === undefined) return

	// 	const range = document.createRange()
	// 	const selection = window.getSelection()!

	// 	// let newRow = currentLocation[0]

	// 	// switch (action) {
	// 	// 	case 'up':
	// 	// 		newRow = currentLocation[0] === 0 ? currentLocation[0] : currentLocation[0] - 1
	// 	// 		break
	// 	// 	case 'down':
	// 	// 		newRow =
	// 	// 			currentLocation[0] === ref.current!.childNodes.length - 1
	// 	// 				? currentLocation[0]
	// 	// 				: currentLocation[0] + 1
	// 	// 		break
	// 	// 	case 'enter':
	// 	// 		newRow = ref.current!.childNodes.length - 1
	// 	// 		break
	// 	// }

	// 	// const elem = ref.current!.childNodes[newRow].childNodes[0].childNodes[0] as Node

	// 	range.setStart(elem, 1)
	// 	range.collapse(true)

	// 	selection!.removeAllRanges()
	// 	selection!.addRange(range)
	// 	ref.current!.focus()

	// 	setAction(undefined)
	// }, [action])

	return (
		<>
			<div
				spellCheck={false}
				data-placeholder='Start typing to begin...'
				ref={ref}
				id='editor'
				className={s.docEdit}
				contentEditable></div>
		</>
	)
}

type EditorProps = {
	currentDocPages: DocumentSnapshot<DocumentData, DocumentData> | undefined
	currentDocumentReference: DocumentReference<DocumentData, DocumentData> | undefined
	user: User | undefined
	currentDoc: DocumentSnapshot<DocumentData, DocumentData> | undefined
	currentText: string
	setCurrentText: Dispatch<SetStateAction<string>>
}

type Action = 'initial' | 'enter' | 'up' | 'down' | 'space' | 'backspace' | undefined
