import s from '@/app/m/[id]/m-d-editor.module.scss'

export function LoadingSq() {
	const backgroundColor = [
		Math.floor(Math.random() * (1 - 0 + 1) + 0),
		Math.floor(Math.random() * (1 - 0 + 1) + 0),
	]
	const borderColor = Math.floor(Math.random() * (1 - 0 + 1) + 0)

	return (
		<div
			className={s.loadingSq}
			style={{
				animationDelay: `${Math.random() * 5}s`,
				backgroundColor:
					backgroundColor[0] === 0
						? 'transparent'
						: backgroundColor[1] === 0
						? 'var(--cta-2)'
						: 'var(--cta-1)',
				border: `1px solid ${
					backgroundColor[0] === 1
						? 'transparent'
						: borderColor === 0
						? 'var(--cta-2)'
						: 'var(--cta-1)'
				}`,
			}}
		/>
	)
}
