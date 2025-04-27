import Option from '@/lib/options/option'
import { capitalize } from '@/lib/utils/textHandler'

interface InputProps {
  params: {
    id: string
    options: Option[]
    value: string | undefined
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
    required: boolean
  }
}

export default function Select(props: Readonly<InputProps>) {
  // props
  const { id, options, value, onChange, required } = props.params

  const name = id

  return (
    <select
      name={name}
      id={id}
      value={value}
      onChange={onChange}
      required={required}
    >
      {options.map((option) => (
        <option key={option.getId()} value={option.getText()}>
          {capitalize(option.getText())}
        </option>
      ))}
    </select>
  )
}
