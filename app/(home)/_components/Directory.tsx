'use client'

import { useContext } from 'react'
import s from '../page.module.scss'
import { PathContext } from '../page'

export default function Directory({
	folders,
	goBackTo,
}: {
	folders: {
		id: string
		name: string
	}[]
	goBackTo: (newPath: string) => string
}) {
	const path = useContext(PathContext)

	return (
		<div className={s.directory}>
			{folders.map(({ name, id }, i) => (
				<button
					onClick={() => {
						if (path.length === 3) {
							return
						} else {
							goBackTo(id)
						}
					}}
					id={id}
					key={i}>
					<p>{name}</p>
					<div />
				</button>
			))}
		</div>
	)
}
