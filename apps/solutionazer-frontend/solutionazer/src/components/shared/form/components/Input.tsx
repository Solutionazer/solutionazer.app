interface InputProps {
  params: {
    type: string
    id: string
    value: string | undefined
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    onBlur?: () => void
    placeholder: string
    required: boolean
    disabled: boolean
  }
}

export default function Input(props: Readonly<InputProps>) {
  const { type, id, value, onChange, onBlur, placeholder, required, disabled } =
    props.params

  const name = id

  return (
    <input
      type={type}
      name={name}
      id={id}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
    />
  )
}
