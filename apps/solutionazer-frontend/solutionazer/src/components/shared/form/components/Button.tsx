import ButtonType from '@/lib/forms/enums/buttonType'

interface ButtonProps {
  params: {
    type: ButtonType
    text: string
  }
}

export default function Button(props: Readonly<ButtonProps>) {
  const { type, text } = props.params

  return <button type={type}>{text}</button>
}
