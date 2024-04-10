import s from './header.module.scss'
import HomeLink from './homelink'
import Login from './login'

export default function Header() {
	return (
		<header
			id='header'
			className={s.header}>
			<HomeLink />
			<Login />
		</header>
	)
}
