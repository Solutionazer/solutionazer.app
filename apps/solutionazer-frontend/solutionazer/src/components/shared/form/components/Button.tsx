import ButtonType from '@/lib/auth/forms/enums/buttonType'
import Image from 'next/image'

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

  const isX: boolean = text === 'X'
  const isCreate: boolean = text === 'Create'
  const isConfig: boolean = text === 'config'
  const isLogOut: boolean = text === 'Log Out'
  const isShare: boolean = text === 'Share'
  const isAdd: boolean = text === '+'

  const renderIcon = (text: string) => {
    switch (text) {
      case 'X':
        return (
          <Image
            src="/icons/orange_bin.svg"
            alt="delete button"
            width={18}
            height={18}
          />
        )
      case 'Create':
        return (
          <Image
            src="/icons/white_add.svg"
            alt="add button"
            width={36}
            height={36}
          />
        )
      case 'config':
        return (
          <Image
            src="/icons/black_config.svg"
            alt="config button"
            width={22}
            height={22}
          />
        )
      case 'Log Out':
        return (
          <Image
            src="/icons/black_logout.svg"
            alt="log out button"
            width={22}
            height={22}
          />
        )
      case 'Share':
        return (
          <Image
            src="/icons/white_share.svg"
            alt="back button"
            width={22}
            height={22}
          />
        )
      case '+':
        return (
          <Image
            src="/icons/black_add.svg"
            alt="add question button"
            width={22}
            height={22}
          />
        )
    }
  }

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {!isX && !isCreate && !isConfig && !isLogOut && !isShare && !isAdd
        ? text
        : renderIcon(text)}
    </button>
  )
}
