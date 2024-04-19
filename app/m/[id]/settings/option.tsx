'use client'

import { CSSProperties, ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react'
import s from '../m-d-editor.module.scss'

export default function Setting({
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

	function colorChange(e: ChangeEvent<HTMLSelectElement>) {
		setColorType(e.target.value as Colors)
	}

	useEffect(() => {
		if (format === undefined) return

		const selObj = window.getSelection()!
		const selRange = selObj.getRangeAt(0)

		const parent = selObj.anchorNode?.parentElement
		const text = parent?.textContent

		const selectedText = text?.substring(selObj.focusOffset, selObj.anchorOffset)
		console.log(selectedText, selObj.focusOffset, selObj.anchorOffset, selRange, selObj)

		parent!.innerHTML = `${text?.substring(0, selObj.focusOffset)}${createHTML(
			format,
			selectedText!
		)}${text?.substring(selObj.anchorOffset)}`

		setFormat(undefined)
	}, [format])

	return (
		<>
			<button onClick={() => setShow(!show)}>Editor background</button>
			<div className={show ? s.setColor : s.display}>
				<div>
					<div
						style={{ background: col }}
						className={s.currentColor}
					/>
					<div>
						<select
							onChange={colorChange}
							name=''
							id='e-b-c'>
							<option value='hex'>Hex</option>
							<option value='rgb'>RGB</option>
						</select>
						<span>{colorType === 'hex' ? '#' : 'rgb('}</span>
						<input
							style={{
								width: colorType === 'hex' ? '4.1rem' : '6rem',
							}}
							id='c-i'
							type='text'
							onChange={(e) => setCol(e.currentTarget.value)}
							placeholder={colorType === 'rgb' ? 'XXX, XXX, XXX' : 'XX XX XX'}
						/>
						{colorType !== 'hex' && <span>{colorType === 'rgb' ? ')' : ''}</span>}
					</div>
					<div>
						<div className={s.cancel}>
							<button onClick={() => setShow(false)}>Cancel</button>
						</div>
						<button
							className={s.apply}
							onClick={() => {
								setBg({
									background: '#' + col,
								})
							}}>
							Apply
						</button>
					</div>
				</div>
			</div>
			<div>
				<button onClick={() => setFormat('span')}>Set to random color</button>
			</div>
			<div>
				<button onClick={() => setFormat('a')}>Set link</button>
			</div>
		</>
	)
}

type Colors = 'rgb' | 'hex'

type Format =
	| undefined
	| 'a'
	| 'span'
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
	| 'code'

function createHTML(value: Format, selectedText: string) {
	const elem = document.createElement(value!)
	elem.textContent = selectedText!

	if (value === 'span') {
		elem.style.color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
			Math.random() * 255
		)}, ${Math.floor(Math.random() * 255)})`
	}

	if (value === 'a') {
		;(elem as HTMLAnchorElement).href = prompt('Enter link here')!
	}

	return elem.outerHTML
}
