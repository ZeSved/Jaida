'use client'

import { Suspense } from 'react'
import HomePage from '../home_page/HomePage'
import Loading from './loading'
import { useRouter } from 'next/navigation'
import NotFound from './not-found'

export default function Home() {
	const router = useRouter()
	if (!router.prefetch) {
		return <NotFound />
	}

	return (
		<Suspense fallback={<Loading />}>
			<HomePage />
		</Suspense>
	)
}
