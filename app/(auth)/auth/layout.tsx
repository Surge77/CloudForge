import React from 'react'

const AuthLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <main className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-10'>
        <div className="absolute inset-0 forge-grid" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,90,31,0.22),transparent_32%),linear-gradient(to_bottom,transparent,rgba(0,0,0,0.3))]" />
        {children}
    </main>
  )
}

export default AuthLayout
