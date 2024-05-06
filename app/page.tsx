import { Suspense } from 'react'
import HomePage from './home_page/HomePage'
import Loading from './loading'

export default async function Home() {
	return (
		<Suspense fallback={<Loading />}>
			<HomePage />
		</Suspense>
	)
}
