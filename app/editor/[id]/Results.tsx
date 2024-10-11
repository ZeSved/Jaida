'use client'

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import s from './m-d-editor.module.scss'

export default function Results({ currentText }: ResultsProps) {
	const resultRef = useRef<HTMLDivElement>(null)
	// const [text, setText] = useState<string>('')

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
}
