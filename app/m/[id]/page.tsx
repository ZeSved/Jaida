'use client'
import s from './m-d-editor.module.scss'

export default function MarkdownEditor() {
	return (
		<main
			style={{ maxHeight: `100vh - ${document.getElementById('header')?.style.width}` }}
			className={s.container}>
			<textarea
				name=''
				id=''
				cols={30}
				rows={10}></textarea>
		</main>
	)
}
