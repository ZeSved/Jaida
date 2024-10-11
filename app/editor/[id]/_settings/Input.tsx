'use client'

import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { CustomInput } from './option'
import s from '../m-d-editor.module.scss'

export default function Input({
	customInput,
	setCustomInput,
}: {
	customInput: CustomInput
	setCustomInput: Dispatch<SetStateAction<CustomInput>>
}) {
	const [mousePosition, setMousePosition] = useState<{ y: number; x: number }>({ y: 0, x: 0 })

	useEffect(() => {
		window.addEventListener('mousemove', handleMouseMovement)

		function handleMouseMovement(e: MouseEvent) {
			setMousePosition({ y: e.clientY, x: e.clientX })
		}

		return () => window.removeEventListener('mousemove', handleMouseMovement)
	}, [])

	return (
		<div
			style={{ top: mousePosition.y, left: mousePosition.x }}
			className={customInput ? s.input : s.display}>
			{customInput === 'image' ? (
				<>
					<InputField inputType='file' />
					<p>or</p>
					<InputField
						inputType='url'
						text='Image Url'
					/>
				</>
			) : (
				<>
					<InputField
						inputType='text'
						text='Link Text'
					/>
					<InputField
						inputType='url'
						text='Link Url'
					/>
				</>
			)}
		</div>
	)
}

function InputField({ text, inputType }: { text?: string; inputType: 'url' | 'text' | 'file' }) {
	const [isFocused, setIsFocused] = useState<boolean>(false)

	return inputType !== 'file' ? (
		<fieldset>
			{isFocused && <legend>{text}</legend>}
			<input
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				type={inputType}
				placeholder={isFocused ? '' : text}
				pattern={inputType === 'url' ? 'https://.*' : ''}
			/>
		</fieldset>
	) : (
		<input
			type={inputType}
			accept='image/*'
		/>
	)
}
