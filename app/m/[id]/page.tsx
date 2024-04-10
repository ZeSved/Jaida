'use client'
import s from './m-d-editor.module.scss'

export default function MarkdownEditor() {
	return (
		<main className={s.container}>
			<div className={s.editor}>
				<div
					id='editor'
					contentEditable></div>
			</div>
		</main>
	)
}
