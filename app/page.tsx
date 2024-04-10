import styles from './page.module.scss'
import MDocCard from './home_page/card'
import Header from './_components/Header/page'

export default function Home() {
	const docs = [
		{ name: 'test', id: crypto.randomUUID() },
		{ name: 'test1', id: crypto.randomUUID() },
		{ name: 'test2', id: crypto.randomUUID() },
		{ name: 'test3', id: crypto.randomUUID() },
		{ name: 'test4', id: crypto.randomUUID() },
		{ name: 'test5', id: crypto.randomUUID() },
	]

	return (
		<>
			<Header />
			<main className={styles.container}>
				<div className={styles.main}>
					{docs.map((d) => (
						<MDocCard
							id={d.id}
							name={d.name}
						/>
					))}
				</div>
			</main>
		</>
	)
}
