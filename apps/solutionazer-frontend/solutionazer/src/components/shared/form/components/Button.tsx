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
  const isBack: boolean = text === '←'
  const isReset: boolean = text === 'Reset'
  const isSave: boolean = text === 'Save'
  const isAddMembers: boolean = text === 'Add members'
  const isCopy: boolean = text === 'Copy'
  const isShowPassword: boolean = text === 'Show Password'

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
            alt="create button"
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
      case '←':
        return (
          <Image
            src="/icons/white_back.svg"
            alt="back button"
            width={18}
            height={18}
          />
        )
      case 'Reset':
        return (
          <Image
            src="/icons/black_reset.svg"
            alt="reset button"
            width={22}
            height={22}
          />
        )
      case 'Save':
        return (
          <Image
            src="/icons/black_save.svg"
            alt="save button"
            width={22}
            height={22}
          />
        )
      case 'Add members':
        return (
          <Image
            src="/icons/white_add.svg"
            alt="add members button"
            width={36}
            height={36}
          />
        )
      case 'Copy':
        return (
          <Image
            src="/icons/white_copy.svg"
            alt="copy link button"
            width={22}
            height={22}
          />
        )
      case 'Show Password':
        return (
          <Image
            src="/icons/black_eye.svg"
            alt="show password button"
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
      {!isX &&
      !isCreate &&
      !isConfig &&
      !isLogOut &&
      !isShare &&
      !isAdd &&
      !isBack &&
      !isReset &&
      !isSave &&
      !isAddMembers &&
      !isCopy &&
      !isShowPassword
        ? text
        : renderIcon(text)}
    </button>
  )
}
