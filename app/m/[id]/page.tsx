'use client'
import { CSSProperties, useEffect, useState } from 'react'
import s from './m-d-editor.module.scss'
import Settings from './settings/page'

export default function MarkdownEditor() {
	const [bg, setBg] = useState<CSSProperties>({ background: '1a1a1a' })

	const text = document.getElementById('editor')!

	useEffect(() => {
		if (text.textContent?.endsWith('(')) {
			text.textContent = `${text.textContent})`
		}
	})

	function handleKeyboard(e: KeyboardEvent) {}

	// useEffect(() => {
	// 	window.addEventListener('keydown', handleKeyboard)

	// 	return () => window.removeEventListener('keydown', handleKeyboard)
	// }, [])

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
