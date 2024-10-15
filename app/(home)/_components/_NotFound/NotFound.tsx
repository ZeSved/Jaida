import s from './NotFound.module.scss'

export default function NotFound({
	message,
}: {
	message: {
		dependentValue: any
		text: string
		action?: React.ReactNode
	}
}) {
	if (message.dependentValue === undefined) {
		return (
			<div className={s.notFound}>
				<h2>{message.text}</h2>
				{message.action ?? ''}
			</div>
		)
	} else return <></>
}
