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

	function colorChange(e: ChangeEvent<HTMLSelectElement>) {
		setColorType(e.target.value as Colors)
	}

	function handleSelection() {
		const selObj = window.getSelection()! as Selection
		const selRange = selObj.getRangeAt(0)

		// const parent = selObj.
	}

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
				<button onClick={handleSelection}>Set to random color</button>
			</div>
		</>
	)
}

type Colors = 'rgb' | 'hex'
