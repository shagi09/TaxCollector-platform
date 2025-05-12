import React from 'react'
import EmployeeCount from '../components/employeeCount'
import IncomeCount from '../components/IncomeCount'
import Chart from '../components/Chart'

const dashBoard = () => {
  return (
    <div className='flex gap-10'>
      <EmployeeCount/>
      <IncomeCount/>
      <Chart/>
      
    </div>
  )
}

export default dashBoard
