'use client'
import Image from 'next/image'
import Jaida_logo from '@/public/Jaida Logo.svg'
import s from './header.module.scss'

export default function HomeLink() {
	return window.location.pathname.startsWith('/m/') ? (
		<Image
			src={Jaida_logo}
			alt='Jaida Logo'
		/>
	) : (
		<>
			<Image
				src={Jaida_logo}
				alt='Jaida Logo'
			/>
			<h1>Jaida</h1>
		</>
	)
}
