'use client'

import { CSSProperties, ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react'
import s from '../m-d-editor.module.scss'
import Input from './Input'

export default function Options({
	setBg,
	bg,
}: {
	setBg: Dispatch<SetStateAction<CSSProperties>>
	bg: CSSProperties
}) {
	const [show, setShow] = useState<boolean>(false)
	const [colorType, setColorType] = useState<Colors>('hex')
	const [col, setCol] = useState<string>('')
	const [format, setFormat] = useState<Format>(undefined)
	const [customInput, setCustomInput] = useState<CustomInput>(undefined)

	function colorChange(e: ChangeEvent<HTMLSelectElement>) {
		setColorType(e.target.value as Colors)
	}

	const buttons = [
		{ text: 'h1', fun: () => setFormat('h1') },
		{ text: 'h2', fun: () => setFormat('h2') },
		{ text: 'h3', fun: () => setFormat('h3') },
		{ text: 'h4', fun: () => setFormat('h4') },
		{ text: 'h5', fun: () => setFormat('h5') },
		{ text: 'h6', fun: () => setFormat('h6') },
		{ text: 'italic', fun: () => setFormat('italic') },
		{ text: 'bold', fun: () => setFormat('bold') },
		{ text: 'important', fun: () => setFormat('important') },
	]

	useEffect(() => {
		if (format === undefined) return

		const selObj = window.getSelection()!
		const selRange = selObj.getRangeAt(0)

		const parent = selObj.anchorNode?.parentElement
		const text = parent?.textContent

		const selectedText = text?.substring(selObj.focusOffset, selObj.anchorOffset)
		console.log(selectedText, selRange, selObj)

		parent!.innerHTML = `${text?.substring(0, selObj.focusOffset)}${createHTML(
			format,
			selectedText!
		)}${text?.substring(selObj.anchorOffset)}`

		setFormat(undefined)
	}, [format])

	return (
		<div className={s.buttonGrid}>
			{buttons.map((b) => (
				<button
					onClick={b.fun}
					key={b.text}>
					{b.text}
				</button>
			))}
		</div>
	)
}

type Colors = 'rgb' | 'hex'

export type CustomInput = 'link' | 'image' | undefined

type Format =
	| undefined
	| 'link'
	| 'color'
	| 'h1'
	| 'h2'
	| 'h3'
	| 'h4'
	| 'h5'
	| 'h6'
	| 'italic'
	| 'bold'
	| 'important'
	| 'image'

function createHTML(requestedElement: Format, selectedText: string) {
	const span = document.createElement('span')
	const spanStyle = span.style

	switch (requestedElement) {
		case 'color':
			spanStyle.color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
				Math.random() * 255
			)}, ${Math.floor(Math.random() * 255)})`
			setText()
			break
		case 'link':
			const link = document.createElement('a')
			link.textContent = selectedText

			span.appendChild(link)
			break
		case 'italic':
			spanStyle.fontStyle = 'italic'
			setText()
			break
		case 'bold':
			spanStyle.fontWeight = 'bold'
			setText()
			break
		case 'important':
			spanStyle.fontStyle = 'italic'
			spanStyle.fontWeight = 'bold'
			setText()
			break
		case 'image':
			const image = document.createElement('img')

			span.appendChild(image)
			break
		case 'h1':
		case 'h2':
		case 'h3':
		case 'h4':
		case 'h5':
		case 'h6':
			const h = document.createElement(requestedElement)
			h.textContent = selectedText

			span.appendChild(h)
	}

	function setText() {
		span.textContent = selectedText
	}

	return span.outerHTML
}
