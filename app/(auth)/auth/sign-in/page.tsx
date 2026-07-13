import SignInFormClient from '@/features/auth/components/sign-in-form-client'
import { AuthBrandPanel } from '@/features/auth/components/auth-brand-panel'
import React from 'react'

const SignInPage = () => {
  return (
    <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border/60 forge-panel-strong md:grid-cols-2">
      <AuthBrandPanel />
      <div className="flex items-center justify-center p-6 sm:p-10">
        <SignInFormClient />
      </div>
    </div>
  )
}

export default SignInPage
