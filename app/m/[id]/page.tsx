'use client'
import { CSSProperties, useEffect, useState } from 'react'
import s from './m-d-editor.module.scss'
import Settings from './settings/page'

export default function MarkdownEditor() {
	const [bg, setBg] = useState<CSSProperties>({ background: 'gray' })

	function handleKeyboard(e: KeyboardEvent) {}

	useEffect(() => {
		window.addEventListener('keydown', handleKeyboard)

		return () => window.removeEventListener('keydown', handleKeyboard)
	}, [])

	console.log('render')
	console.log(bg)

	return (
		<main className={s.main}>
			<Settings
				setBg={setBg}
				bg={bg}
			/>
			<div className={s.container}>
				<div className={s.editor}>
					<div
						style={bg}
						id='editor'
						contentEditable></div>
				</div>
			</div>
		</main>
	)
}
