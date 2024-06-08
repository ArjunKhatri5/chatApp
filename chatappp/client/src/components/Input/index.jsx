import React from 'react'

function Input({
    label= '',
    name= '',
    type= 'text',
    className= '',
    inputClassName='',
    isRequired= true,
    placeholder= '',
    value= '',
    onChange= ()=>{},
    isDisabled= false,
}) {
  return (
    <div className={`w-full ${className}`} >
      <label htmlFor={name} className={`block text-sm font-medium text-grayCustom`} >{label}</label>
      <input type={type} id={name} className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm
      focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${inputClassName}`} placeholder={placeholder} required={isRequired} 
      value={value} onChange={onChange} disabled={isDisabled}></input>
    </div>
  )
}

export default Input
