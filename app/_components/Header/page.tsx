import JaidaLogo from '@/public/JaidaLogo'
import s from './header.module.scss'
// import Login from './login'

export default function Header() {
	return (
		<header
			id='header'
			className={s.header}>
			<JaidaLogo
				width='59'
				height='51'
				viewBox='59 91'
			/>
			<h1>Jaida</h1>
			{/* <Login /> */}
		</header>
	)
}
