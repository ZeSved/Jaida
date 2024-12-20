'use client'

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import s from '../m-d-editor.module.scss'
import {
	updateDoc,
	doc,
	DocumentSnapshot,
	DocumentData,
	DocumentReference,
} from 'firebase/firestore'
import { User } from 'firebase/auth'
import { converter } from '../_utils/converter'

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
	const ref = useRef<HTMLTextAreaElement>(null)

	useEffect(() => {
		if (currentDocPages && ref) {
			// const loadedDocContent = parser({
			// 	content: currentDocPages.data()?.content,
			// 	action: 'GET-DB',
			// }) as string

			// ref.current!.innerHTML =
			// 	(parser({ action: 'GET-DB', content: currentDocPages.data()?.content }) as string) ?? ''
			// // ref.current!.append(loadedDocContent)

			ref.current!.value = currentDocPages.data()?.content
		}

		function handleKeyboardInit(e: Event & KeyboardEvent) {
			if (!ref.current) return

			if (currentDocumentReference) {
				setTimeout(async () => {
					await updateDoc(doc(currentDocumentReference, 'pages', 'PAGE-1'), {
						content: ref.current!.value,
					})
				}, 10)
			}

			setTimeout(() => converter(ref.current!.value, setCurrentText), 1)
			// if (/[^#*_\~`>\-\+=\|[\](){},!\\@:]+/.test(e.key)) {
			// }

			// handleKeyboard(e)
		}

		window.addEventListener('keydown', handleKeyboardInit)

		return () => window.removeEventListener('keydown', handleKeyboardInit)
	}, [currentDocPages, ref])

	return (
		<>
			{/* <div
				spellCheck={false}
				data-placeholder='Start typing to begin...'
				ref={ref}
				id='editor'
				className={s.docEdit}
				contentEditable></div> */}
			<textarea
				spellCheck={false}
				placeholder='Start typing to begin...'
				ref={ref}
				id='editor'
				className={s.docEdit}></textarea>
			<button
				onClick={() => {
					const link = document.createElement('a')
					link.href = 'data:text/markdown;charset=UTF-16,' + encodeURIComponent(ref.current!.value)
					link.setAttribute('download', currentDoc!.data()?.name + '.md')
					link.click()
				}}>
				download
			</button>
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
