import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.scss'
import Header from './_components/Header/page'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Jaida',
	description: 'Generated by create next app',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<div className='main_content'>{children}</div>
			</body>
		</html>
	)
}
