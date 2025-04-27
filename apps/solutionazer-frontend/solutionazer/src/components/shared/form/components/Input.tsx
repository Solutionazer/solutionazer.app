interface InputProps {
  params: {
    type: string
    id: string
    value: string | undefined
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    placeholder: string
    required: boolean
    disabled: boolean
  }
}

export default function Input(props: Readonly<InputProps>) {
  const { type, id, value, onChange, placeholder, required, disabled } =
    props.params

  const name = id

  return (
    <input
      type={type}
      name={name}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
    />
  )
}
