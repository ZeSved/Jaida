'use client'

import { useEffect, useRef, useState } from 'react'
import s from './m-d-editor.module.scss'
import {
	updateDoc,
	doc,
	DocumentSnapshot,
	DocumentData,
	DocumentReference,
} from 'firebase/firestore'
import { parser } from './utils/parser'
import { replacements } from './utils/replacements'
import { divId } from './utils/divId'
import { Caret } from './utils/handleKeyboard'

export default function Editor({ currentDocPages, currentDocumentReference }: EditorProps) {
	const [currentRow, setCurrentRow] = useState<number>(0)
	const [action, setAction] = useState<Action>(undefined)
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (currentDocPages && ref) {
			const loadedDocContent = parser({
				content: currentDocPages.data()?.content,
				action: 'GET-DB',
			}) as string
			// ref.current!.innerHTML = (parser(currentDocPages.data()?.content, 'GET-DB')) ?? ''
			ref.current!.innerHTML = loadedDocContent
		}

		function handleKeyboardInit(e: Event & KeyboardEvent) {
			if (currentDocumentReference) {
				setTimeout(async () => {
					await updateDoc(doc(currentDocumentReference, 'pages', 'PAGE-1'), {
						content: parser({ action: 'POST-DB', content: ref.current!.children }),
					})
				}, 10)
			}

			handleKeyboard(e)
		}

		window.addEventListener('keydown', handleKeyboardInit)

		return () => window.removeEventListener('keydown', handleKeyboardInit)
	}, [currentDocPages, ref])

	function handleKeyboard(e: Event & KeyboardEvent) {
		if (!ref) return

		// if (/^[a-zA-Z]$/.test(e.key)) {
		// 	if (ref.current!.childNodes.length === 1) {
		// 		e.preventDefault()
		// 		ref.current!.innerHTML += `<div><span><span>${e.key}</span></span></div>`
		// 		setAction('initial')
		// 		return
		// 	}
		// 	// if (!ref.current!.hasChildNodes()) {

		// 	// }
		// }

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

			setAction('space')
		}

		if (e.key === 'Enter') {
			e.preventDefault()
			setCurrentRow(Caret.enter(ref, currentRow)!)
		}

		if (e.key === 'Backspace') {
			setTimeout(() => Caret.backspace(ref), 0)
		}

		if (e.key === 'ArrowUp') {
			e.preventDefault()
			setAction('up')
		}

		if (e.key === 'ArrowDown') {
			e.preventDefault()
			setAction('down')
		}
	}

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
		<div
			ref={ref}
			id='editor'
			className={s.docEdit}
			contentEditable></div>
	)
}

type EditorProps = {
	currentDocPages: DocumentSnapshot<DocumentData, DocumentData> | undefined
	currentDocumentReference: DocumentReference<DocumentData, DocumentData> | undefined
}

type Action = 'initial' | 'enter' | 'up' | 'down' | 'space' | 'backspace' | undefined
