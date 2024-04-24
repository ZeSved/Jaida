'use client'

export default function Input({ mode }: { mode: 'link' | 'image' }) {
	return (
		<div>
			{mode === 'image' ? (
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
	return inputType !== 'file' ? (
		<fieldset>
			<legend>{text}</legend>
			<input
				type={inputType}
				placeholder={text}
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
