import React from 'react'

function Footer() {
    const today = new Date()
    const year = today.getFullYear()
  return (
    <div className='w-full h-20 flex text-[10px] md:text-[15px] items-center justify-center flex-col dark:bg-[#0a0a0a] '>
         <span>© {year} - Events@UCEK</span>
         <span>An Initiative by IEEE SB UCEK.</span>
    </div>
  )
}

export default Footer