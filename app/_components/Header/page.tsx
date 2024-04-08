import Image from 'next/image'
import Jaida_logo from '@/public/Jaida Logo size 1.svg'
import s from './header.module.scss'

export default function Header() {
	return (
		<header
			id='header'
			className={s.header}>
			<Image
				src={Jaida_logo}
				alt='Jaida Logo'
			/>
			<h1>Jaida</h1>
			<div></div>
		</header>
	)
}
