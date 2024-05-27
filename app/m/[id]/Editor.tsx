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

export default function Editor({ currentDocPages, currentDocumentReference }: EditorProps) {
	const [currentLocation, setCurrentLocation] = useState<number[]>([0, 0])
	const [action, setAction] = useState<Action>(undefined)
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (currentDocPages && ref) {
			const loadedDocContent = parser({
				content: currentDocPages.data()?.content,
				action: 'GET-DB',
			}) as string
			// ref.current!.innerHTML = (parser(currentDocPages.data()?.content, 'GET-DB')) ?? ''
			ref.current!.innerHTML =
				loadedDocContent.length === 0 ? `<div><span></span></div>` : loadedDocContent
		}

		function handleKeyboardInit(e: Event & KeyboardEvent) {
			if (currentDocumentReference) {
				setTimeout(async () => {
					await updateDoc(doc(currentDocumentReference, 'pages', 'PAGE-1'), {
						content: parser({ action: 'POST-DB', content: ref.current!.innerHTML }),
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

		if (/^[a-zA-Z]$/.test(e.key)) {
			if (!ref.current!.hasChildNodes()) {
				e.preventDefault()
				ref.current!.innerHTML += `<div><span><span>${e.key}</span></span></div>`

				if (ref.current!.childNodes.length === 0) {
					setAction('initial')
					return
				}
			}

			// ref.current!.innerHTML += `<div><span><span>${'\n'}</span></span></div>`
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

			setAction('space')
		}

		if (e.key === 'Enter') {
			e.preventDefault()
			ref.current!.innerHTML += `<div><span><span>${'\n'}</span></span></div>`
			setAction('enter')
		}

		if (
			e.key === 'Backspace' &&
			ref.current!.childNodes[1] === undefined &&
			ref.current!.childNodes[0].textContent?.length === 0
		) {
			e.preventDefault()
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

	useEffect(() => {
		if (action === undefined) return

		const range = document.createRange()
		const selection = window.getSelection()!

		let newRow = currentLocation

		switch (action) {
			case 'up':
				newRow =
					currentLocation[0] === 0 ? currentLocation : [currentLocation[0] - 1, currentLocation[1]]
				break
			case 'down':
				newRow =
					currentLocation[0] === ref.current!.childNodes.length - 1
						? currentLocation
						: [currentLocation[0] + 1, currentLocation[1]]
				break
			case 'enter':
				newRow = [ref.current!.childNodes.length - 1, 0]
				break
		}

		const elem =
			ref.current!.childNodes[newRow[0]].childNodes[0].childNodes[newRow[1]].childNodes[0]

		range.setStart(elem, 1)
		range.collapse(true)

		selection!.removeAllRanges()
		selection!.addRange(range)
		ref.current!.focus()

		setCurrentLocation(newRow)
		setAction(undefined)
	}, [action])

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
