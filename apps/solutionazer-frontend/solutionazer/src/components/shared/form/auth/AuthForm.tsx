/**
 * This file is part of solutionazer.app.
 *
 * solutionazer.app is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3 of the License only.
 *
 * solutionazer.app is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with solutionazer.app. If not, see <https://www.gnu.org/licenses/gpl-3.0.en.html>.
 *
 * Copyright (C) 2025 David Llamas Román
 */

import MediumTitle from '../../titles/MediumTitle'
import Section from '../../containers/Section'
import { Dispatch, ReactElement, SetStateAction } from 'react'
import RegisterForm from '@/components/register/form/RegisterForm'
import LoginForm from '@/components/login/form/LoginForm'
import VerifyEmailForm from '@/components/login/form/VerifyEmailForm'

import styles from './authForm.module.css'

// props interface
interface AuthFormProps {
  params: {
    context: string
    isPasswordEmpty?: boolean
    setIsPasswordEmpty?: Dispatch<SetStateAction<boolean | undefined>>
    infoMessage?: string | null
  }
}

export default function AuthForm(props: Readonly<AuthFormProps>) {
  // props
  const { context, isPasswordEmpty, setIsPasswordEmpty, infoMessage } =
    props.params

  // evaluate 'context' | is 'login'?
  const isLogin: boolean = context === 'login'

  // evaluate 'context' | is 'register'?
  const isRegister: boolean = context === 'register'
  // change title depending on 'context' value
  const isRegisterTitleResult: string = isRegister
    ? `Don't have an account yet?`
    : 'We were waiting for you...'
  // load one component or other depending on 'context' value
  const isRegisterMainResult: ReactElement = isRegister ? (
    <RegisterForm />
  ) : (
    <LoginForm params={{ isPasswordEmpty, setIsPasswordEmpty, infoMessage }} />
  )

  return (
    <Section params={{ className: styles.section }}>
      <MediumTitle
        params={{
          text: isLogin ? 'Enter your email' : isRegisterTitleResult,
          classNames: [styles.medium_title, styles.background_color],
        }}
      />
      {isLogin ? <VerifyEmailForm /> : isRegisterMainResult}
    </Section>
  )
}
