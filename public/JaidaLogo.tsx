export default function JaidaLogo({
	width,
	height,
	viewBox,
}: {
	width: string
	height: string
	viewBox: string
}) {
	return (
		<svg
			width={width}
			height={height}
			viewBox={`0 0 ${viewBox}`}
			fill='none'
			xmlns='http://www.w3.org/2000/svg'>
			<path
				d='M8.02 61.6638C8.02 87.4853 46.6986 87.4853 46.6986 61.6638C46.6986 52.8792 46.6986 16.8739 46.6986 0.970093'
				stroke='url(#paint0_linear_1_31)'
				stroke-width='14.88'
			/>
			<ellipse
				cx='46.5499'
				cy='45.5587'
				rx='14.4301'
				ry='12.9107'
				fill='#1a1a1a'
			/>
			<defs>
				<linearGradient
					id='paint0_linear_1_31'
					x1='3.85461'
					y1='41.1664'
					x2='61.1449'
					y2='72.8656'
					gradientUnits='userSpaceOnUse'>
					<stop stop-color='#6c00d0' />
					<stop
						offset='1'
						stop-color='#a800eb'
					/>
				</linearGradient>
			</defs>
		</svg>
	)
}
