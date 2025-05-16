interface InputProps {
  params: {
    type: string
    id: string
    accept?: string
    value: string | number | undefined
    minLength?: number
    maxLength?: number
    min?: string | number
    max?: string | number
    step?: number
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
    accept,
    value,
    minLength,
    maxLength,
    min,
    max,
    step,
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
      accept={accept}
      value={value}
      minLength={minLength}
      maxLength={maxLength}
      min={min}
      max={max}
      step={step}
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
