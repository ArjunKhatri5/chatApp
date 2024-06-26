import React from 'react'

function Button({
    label='',
    type='button',
    className='',
    disabled=false,
}) {
  return (
      <button type={type} className={`text-white bg-primary hover:bg-sky-600 focus:ring-4 focus:outine-none
      focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center ${className}`} disabled={disabled} >
      {label}
      </button>
  )
}

export default Button
