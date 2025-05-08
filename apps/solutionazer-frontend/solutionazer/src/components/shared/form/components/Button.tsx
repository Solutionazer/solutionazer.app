import ButtonType from '@/lib/auth/forms/enums/buttonType'

interface ButtonProps {
  params: {
    type?: ButtonType
    text: string
    className?: string
    onClick?: () => void
    disabled?: boolean
  }
}

export default function Button(props: Readonly<ButtonProps>) {
  const { type, text, className, onClick, disabled } = props.params

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  )
}
