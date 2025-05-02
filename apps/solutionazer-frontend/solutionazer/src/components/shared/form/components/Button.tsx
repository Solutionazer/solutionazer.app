import ButtonType from '@/lib/forms/enums/buttonType'

interface ButtonProps {
  params: {
    type?: ButtonType
    text: string
    className?: string
    onClick?: () => void
  }
}

export default function Button(props: Readonly<ButtonProps>) {
  const { type, text, className, onClick } = props.params

  return (
    <button type={type} className={className} onClick={onClick}>
      {text}
    </button>
  )
}
