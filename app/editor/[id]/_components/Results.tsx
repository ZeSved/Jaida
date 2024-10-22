'use client'

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import s from './m-d-editor.module.scss'
import { DocumentSnapshot, DocumentData } from 'firebase/firestore'
import { converter } from '../_utils/converter'

export default function Results({ currentText, currentDocPages, setCurrentText }: ResultsProps) {
	const resultRef = useRef<HTMLDivElement>(null)
	// const [text, setText] = useState<string>('')

	useEffect(() => {
		if (currentDocPages) {
			converter(currentDocPages!.data()?.content, setCurrentText)
		}
	}, [currentDocPages])

	useEffect(() => {
		// setText(currentText)
		resultRef.current!.innerHTML = currentText
	}, [currentText])

	return (
		<div
			ref={resultRef}
			data-placeholder='And view the results here...'
			className={s.results}>
			{/* {currentText} */}
		</div>
	)
}

type ResultsProps = {
	currentText: string
	setCurrentText: Dispatch<SetStateAction<string>>
	currentDocPages: DocumentSnapshot<DocumentData, DocumentData> | undefined
}
