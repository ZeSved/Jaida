'use client'
import JaidaLogo from '@/public/JaidaLogo'

export default function HomeLink() {
	return window.location.pathname.startsWith('/m/') ? (
		<JaidaLogo
			width='29'
			height='41'
			viewBox='49 91'
		/>
	) : (
		<>
			<JaidaLogo
				width='59'
				height='51'
				viewBox='59 91'
			/>
			<h1>Jaida</h1>
		</>
	)
}
