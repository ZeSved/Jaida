import Link from 'next/link'
import Image from 'next/image'
import Jaida_small_logo from '@/public/Jaida Logo size 2.svg'
import s from '@/app/page.module.scss'

export default function MDocCard({ name, id }: { name: string; id: string }) {
	return (
		<Link
			className={s.card}
			href={`/m/${id}`}>
			<Image
				src={Jaida_small_logo}
				alt='Jadia small logo'
			/>
			<div></div>
			<p>{name}</p>
		</Link>
	)
}
