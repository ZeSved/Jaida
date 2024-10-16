import Login from '@/components/Login/login'
import Doc from '@/public/Doc 4.svg'
import s from '../m-d-editor.module.scss'
import { CSSProperties, Dispatch, SetStateAction } from 'react'
import Options from './option'
import Link from 'next/link'
import Image from 'next/image'

export default function Settings({
	setBg,
	bg,
}: {
	setBg: Dispatch<SetStateAction<CSSProperties>>
	bg: CSSProperties
}) {
	return (
		<header className={s.header}>
			<section>
				<Link href={'/'}>
					<Image
						height={70}
						width={70}
						alt=''
						src={Doc}
					/>
				</Link>
			</section>
			<section>
				<Options
					setBg={setBg}
					bg={bg}
				/>
			</section>
			<Login />
		</header>
	)
}
