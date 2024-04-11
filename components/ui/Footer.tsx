import React from 'react'

function Footer() {
    const today = new Date()
    const year = today.getFullYear()
  return (
    <div className='w-full h-20 flex items-center justify-center dark:bg-[#0a0a0a] '>
         © {year} Events@UCEK
    </div>
  )
}

export default Footer