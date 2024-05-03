import Login from '@/app/_components/Header/login'
import JaidaLogo from '@/public/JaidaLogo'
import s from '../m-d-editor.module.scss'
import { CSSProperties, Dispatch, SetStateAction } from 'react'
import Setting from './option'

export default function Settings({
	setBg,
	bg,
}: {
	setBg: Dispatch<SetStateAction<CSSProperties>>
	bg: CSSProperties
}) {
	return (
		<header className={s.header}>
			<JaidaLogo
				width='29'
				height='41'
				viewBox='49 91'
			/>
			<Setting
				setBg={setBg}
				bg={bg}
			/>
			<Login />
		</header>
	)
}
