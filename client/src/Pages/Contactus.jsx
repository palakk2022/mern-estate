import React from 'react'
import { FaPhone, FaComment } from 'react-icons/fa';
export default function Contactus() {
  return (
    <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto font-bold'>
     <h1 className='font-bold'>Contact 
      <span className='text-slate-600 font-bold'>Us...</span>
     </h1>
     <div className='text-gray-400 text-xs sm:text-sm'>
       <p> <span className='text-slate-700 font-semibold'>Why Contact Us?</span>
        "Need help or have questions? Our dedicated team is here to provide you with the information and guidance you need.
        <br/> Whether it's about property details, scheduling a visit, or general inquiries, we’re just a message away.
        <br/> Don’t hesitate to connect with us!"</p>
     </div>
     <div className='text-gray-400 text-xs sm:text-sm flex justify-center mt-64 bg-gray-300s'>
    <div className='flex text-gray-500 justify-items-start'>
    <FaPhone size={30} style={{ color: 'ge', margin: '10px' }} />
        <h1 >+00 123 456 7890
        </h1>
   </div>
    
  <div className='flex text-gray-500 justify-items-start'>
  <FaComment size={30} style={{ color: 'ge', margin: '10px' }}
         /><h1>+00 123 456 7890</h1>
  </div>
       
        
     </div>
    </div>
  )
}
