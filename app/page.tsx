import Image from 'next/image'
import styles from './page.module.css'
import Link from 'next/link'

export default function Home() {
	const ids = [
		{ id: 'test' },
		{ id: 'dweauiduw' },
		{ id: 'wwwwwwwwwwwww' },
		{ id: 'yeet' },
		{ id: 'test783789' },
	]

	return (
		<main className={styles.main}>
			{ids.map((d) => (
				<Link
					style={{ paddingInline: 10 }}
					href={`/m/${d.id}`}>
					{d.id}
				</Link>
			))}
		</main>
	)
}
