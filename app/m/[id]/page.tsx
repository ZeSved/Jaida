'use client'
import s from './m-d-editor.module.scss'

export default function MarkdownEditor() {
	return (
		<main className={s.container}>
			<div contentEditable></div>
		</main>
	)
}
