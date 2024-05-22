import s from './loadingSquare.module.scss'

export function LoadingSq() {
	return (
		<div className={s.loadingSqWrapper}>
			<div className={`${s.sq} ${s.sq1}`} />
			<div className={`${s.sq} ${s.sq2}`} />
			<div className={`${s.sq} ${s.sq3}`} />
			<div className={`${s.sq} ${s.sq4}`} />
		</div>
	)
}
