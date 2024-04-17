'use client'
import { CSSProperties, useEffect, useReducer, useRef, useState } from 'react'
import s from './m-d-editor.module.scss'
import Settings from './settings/page'

const replacements = {
	alpha: {
		active: true,
		options: [
			{ text: 'Α', active: true },
			{ text: 'α', active: false },
		],
	},
	beta: {
		active: true,
		options: [
			{ text: 'Β', active: true },
			{ text: 'β', active: false },
		],
	},
	gamma: {
		active: true,
		options: [
			{ text: 'Γ', active: true },
			{ text: 'γ', active: false },
		],
	},
	delta: {
		active: true,
		options: [
			{ text: 'Δ', active: true },
			{ text: 'δ', active: false },
		],
	},
	epsilon: {
		active: true,
		options: [
			{ text: 'Ε', active: true },
			{ text: 'ε', active: false },
		],
	},
	zeta: {
		active: true,
		options: [
			{ text: 'Ζ', active: true },
			{ text: 'ζ', active: false },
		],
	},
	eta: {
		active: true,
		options: [
			{ text: 'Η', active: true },
			{ text: 'η', active: false },
		],
	},
	theta: {
		active: true,
		options: [
			{ text: 'Θ', active: true },
			{ text: 'θ', active: false },
		],
	},
	iota: {
		active: true,
		options: [
			{ text: 'Ι', active: true },
			{ text: 'ι', active: false },
		],
	},
	kappa: {
		active: true,
		options: [
			{ text: 'Κ', active: true },
			{ text: 'κ', active: false },
		],
	},
	lambda: {
		active: true,
		options: [
			{ text: 'Λ', active: true },
			{ text: 'λ', active: false },
		],
	},
	mu: {
		active: true,
		options: [
			{ text: 'Μ', active: true },
			{ text: 'μ', active: false },
		],
	},
	nu: {
		active: true,
		options: [
			{ text: 'Ν', active: true },
			{ text: 'ν', active: false },
		],
	},
	xi: {
		active: true,
		options: [
			{ text: 'Ξ', active: true },
			{ text: 'ξ', active: false },
		],
	},
	omicron: {
		active: true,
		options: [
			{ text: 'Ο', active: true },
			{ text: 'ο', active: false },
		],
	},
	pi: {
		active: true,
		options: [
			{ text: 'Π', active: true },
			{ text: 'π', active: false },
		],
	},
	rho: {
		active: true,
		options: [
			{ text: 'Ρ', active: true },
			{ text: 'ρ', active: false },
		],
	},
	sigma: {
		active: true,
		options: [
			{ text: 'Σ', active: true },
			{ text: 'σ', active: false },
		],
	},
	tau: {
		active: true,
		options: [
			{ text: 'Τ', active: true },
			{ text: 'τ', active: false },
		],
	},
	upsilon: {
		active: true,
		options: [
			{ text: 'Υ', active: true },
			{ text: 'υ', active: false },
		],
	},
	phi: {
		active: true,
		options: [
			{ text: 'Φ', active: true },
			{ text: 'φ', active: false },
		],
	},
	chi: {
		active: true,
		options: [
			{ text: 'Χ', active: true },
			{ text: 'χ', active: false },
		],
	},
	psi: {
		active: true,
		options: [
			{ text: 'Ψ', active: true },
			{ text: 'ψ', active: false },
		],
	},
	omega: {
		active: true,
		options: [
			{ text: 'Ω', active: true },
			{ text: 'ω', active: false },
		],
	},
}

const names = [
	'alpha',
	'beta',
	'gamma',
	'delta',
	'epsilon',
	'zeta',
	'eta',
	'theta',
	'iota',
	'kappa',
	'lambda',
	'mu',
	'nu',
	'xi',
	'omicron',
	'pi',
	'rho',
	'sigma',
	'tau',
	'upsilon',
	'phi',
	'chi',
	'psi',
	'omega',
] as const

function reducer(rep: typeof replacements, action: Action) {
	return
}

type Action = {
	type: `set-${string & typeof names}`
	payload: typeof replacements
}

export default function MarkdownEditor() {
	const [rep, dispatch] = useReducer(reducer, replacements)
	const [bg, setBg] = useState<CSSProperties>({ background: '1a1a1a' })
	const ref = useRef<HTMLDivElement>(null)

	function handleKeyboard(e: Event & KeyboardEvent) {
		if (e.key === ' ') {
			for (let i = 0; i < names.length; i++) {
				const r = rep[`${names[i]}`]

				if (!r.active) continue
				const newString = ref.current!.textContent!.replace(
					new RegExp(names[i], 'gi'),
					r.options.find((t) => t.active === true)!.text
				)
				ref.current!.textContent = newString
			}

			// replacements.forEach((r) => {
			// 	if (!r.active)
			// 	const newString = ref.current!.textContent!.replace(new RegExp(r[0], 'gi'), r[1])
			// 	ref.current!.textContent = newString
			// })
		}
	}

	useEffect(() => {
		window.addEventListener('keydown', handleKeyboard)

		return () => window.removeEventListener('keydown', handleKeyboard)
	}, [])

	return (
		<main className={s.main}>
			<Settings
				setBg={setBg}
				bg={bg}
			/>
			<div className={s.container}>
				<div className={s.editor}>
					<div
						ref={ref}
						style={bg}
						id='editor'
						contentEditable>
						{ref.current?.textContent}
					</div>
				</div>
			</div>
		</main>
	)
}
