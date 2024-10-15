import s from './NotFound.module.scss'

export default function NotFound({
	message,
}: {
	message: {
		condition: any
		text: string
		action?: React.ReactNode
	}
}) {
	if (message.condition) {
		return (
			<div className={s.notFound}>
				<h2>{message.text}</h2>
				{message.action ?? ''}
			</div>
		)
	} else return <></>
}
