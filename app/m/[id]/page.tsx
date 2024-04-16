'use client'
import { CSSProperties, useEffect, useRef, useState } from 'react'
import s from './m-d-editor.module.scss'
import Settings from './settings/page'

export default function MarkdownEditor() {
	const [bg, setBg] = useState<CSSProperties>({ background: '1a1a1a' })
	const ref = useRef<HTMLDivElement>(null)

	function handleKeyboard(e: Event & KeyboardEvent) {
		if (e.key === ' ') {
			const newString = ref.current!.textContent!.replace(/delta/gi, 'Δ')

			ref.current!.textContent = newString
		}
	}

	useEffect(() => {
		window.addEventListener('keydown', handleKeyboard)

		return () => window.removeEventListener('keydown', handleKeyboard)
	}, [])

	return (
		<main className={s.main}>
			<Settings
				setBg={setBg}
				bg={bg}
			/>
			<div className={s.container}>
				<div className={s.editor}>
					<div
						ref={ref}
						style={bg}
						id='editor'
						contentEditable>
						{ref.current?.textContent}
					</div>
				</div>
			</div>
		</main>
	)
}
