import React from 'react'

function Footer() {
    const today = new Date()
    const year = today.getFullYear()
  return (
    <div className='w-full h-20 flex text-[10px] md:text-[15px] items-center justify-center flex-row dark:bg-[#0a0a0a] '>
         © {year} Events@UCEK
An Initiative by IEEE SB UCEK.
    </div>
  )
}

export default Footer