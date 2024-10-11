import JaidaLogo from '@/public/Jaida logo 8.svg'
import s from './header.module.scss'
import Login from './_components/login'
import Image from 'next/image'

export default function Header() {
	return (
		<header
			id='header'
			className={s.header}>
			<Image
				alt=''
				src={JaidaLogo}
			/>
			<Login />
		</header>
	)
}
