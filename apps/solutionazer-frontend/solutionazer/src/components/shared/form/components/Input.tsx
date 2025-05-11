interface InputProps {
  params: {
    type: string
    id: string
    value: string | undefined
    minLength?: number
    maxLength?: number
    pattern?: string
    title?: string
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    onBlur?: () => void
    placeholder: string
    required: boolean
    disabled: boolean
  }
}

export default function Input(props: Readonly<InputProps>) {
  const {
    type,
    id,
    value,
    minLength,
    maxLength,
    pattern,
    title,
    onChange,
    onBlur,
    placeholder,
    required,
    disabled,
  } = props.params

  const name = id

  return (
    <input
      type={type}
      name={name}
      id={id}
      value={value}
      minLength={minLength}
      maxLength={maxLength}
      pattern={pattern}
      title={title}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
    />
  )
}
