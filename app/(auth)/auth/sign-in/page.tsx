import SignInFormClient from '@/features/auth/components/sign-in-form-client'
import React from 'react'

const SignInPage = () => {
  return (
    <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-6">
        <SignInFormClient/>
    </div>
  )
}

export default SignInPage
