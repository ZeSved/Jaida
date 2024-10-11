import s from './Loading.module.scss'

export default function Loading({
	children,
	condition,
}: {
	children?: React.ReactNode
	condition: boolean
}) {
	return condition ? (
		<div className={s.loadingSqWrapper}>
			<div className={`${s.sq} ${s.sq1}`} />
			<div className={`${s.sq} ${s.sq2}`} />
			<div className={`${s.sq} ${s.sq3}`} />
			<div className={`${s.sq} ${s.sq4}`} />
		</div>
	) : (
		<>{children}</>
	)
}
