'use client'
import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from 'react'
import s from './m-d-editor.module.scss'
import { Action, handleKeyboard } from './utils/handleKeyboard'
import {
	updateDoc,
	doc,
	DocumentSnapshot,
	DocumentData,
	DocumentReference,
} from 'firebase/firestore'
import { parser } from './utils/parser'

export default function Editor({ currentDocPages, currentDocumentReference }: EditorProps) {
	const [currentRow, setCurrentRow] = useState<number>(0)
	const [action, setAction] = useState<Action>()
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (currentDocPages && ref) {
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

		function handleKeyboardInit(e: Event & KeyboardEvent) {
			if (currentDocumentReference) {
				setTimeout(async () => {
					await updateDoc(doc(currentDocumentReference, 'pages', 'PAGE-1'), {
						content: parser({ action: 'POST-DB', content: ref.current!.innerHTML }),
					})
				}, 10)
			}

			handleKeyboard(e, ref, currentRow, setCurrentRow)

			if (e.key === 'Enter') {
				setCurrentRow((c) => c + 1)
			}
		}

		window.addEventListener('keydown', handleKeyboardInit)

		return () => window.removeEventListener('keydown', handleKeyboardInit)
	}, [currentDocPages, ref])

	// useEffect(() => {
	// 	switch (action) {
	// 		case 'enter':
	// 			setCurrentRow((c) => c + 1)
	// 			break
	// 	}
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
