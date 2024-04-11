'use client'

import { CSSProperties, ChangeEvent, Dispatch, SetStateAction, useState } from 'react'
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

	return (
		<>
			<button onClick={() => setShow(!show)}>Editor background</button>
			<div style={{ display: show ? 'flex' : 'none', position: 'absolute', top: '3rem' }}>
				<div className={s.currentColor} />
				<select
					onChange={(e) => colorChange}
					name=''
					id='e-b-c'>
					<option value='hex'>Hex/Hex-A</option>
					<option value='rgb'>RGB/RGBA</option>
				</select>
				<input
					id='c-i'
					type='text'
					value={bg.background}
					onChange={(e) => setCol(e.currentTarget.value)}
					placeholder={colorType === 'rgb' ? 'xxx, xxx, xxx, xxx' : 'xx xx xx xx'}
				/>
				<button onClick={() => setShow(false)}>Cancel</button>
				<button
					onClick={() => {
						setBg({
							background: '#' + col,
						})
					}}>
					Apply
				</button>
			</div>
		</>
	)
}

type Colors = 'rgb' | 'hex'
