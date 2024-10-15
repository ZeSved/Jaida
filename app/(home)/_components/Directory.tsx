import s from '../page.module.scss'

export default function Directory({
	folders,
}: {
	folders: {
		id: string
		name: string
	}[]
}) {
	return (
		<div className={s.directory}>
			{folders.map(({ name, id }, i) =>
				i < folders.length - 1 ? (
					<div key={i}>
						<p>{name}</p>
						<div />
					</div>
				) : (
					<></>
				)
			)}
		</div>
	)
}
