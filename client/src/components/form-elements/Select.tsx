import React, { SelectHTMLAttributes } from 'react'

const Select = ({children,...porps}:SelectHTMLAttributes<HTMLSelectElement>) => {
  return (
    <div className="dropdown">
        <select className="form-select" {...porps}>
          {children}
        </select>
    </div>
  )
}

export default Select
