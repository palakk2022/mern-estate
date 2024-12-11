import {FaSearch} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {useSelector} from 'react-redux';
export default function Header() {
  const {currentUser} = useSelector(state => state.user)
  return (
    <header className='bg-slate-200 shadow-md '>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3 '>
            <Link to="/">
        <h1 className='font-bold text-sm sm:text-xl flex flex:-wrap '>
        <span className='text-slate-500  '>Elevate</span>
        <span className='text-slate-700  '> Estates</span>
          </h1>
      </Link>

      <form className='bg-slate-100 p-3 rounded-lg flex items-center hover:bg-slate-200'>
        <input type="text" 
        placeholder='Search...'
         className='bg-transparent focus:outline-none w-24 sm:w-64'/>
        <FaSearch className='text-slate-600'/>
      </form>
      <ul className='flex gap-4'>
        <Link to="/"><li className='hidden sm:inline text-slate-700 hover:bg-slate-300 hover:underline' >Properties</li></Link>
         <Link to="/about"><li  className='hidden sm:inline  text-slate-700 hover:underline hover:bg-slate-300'>About</li></Link> 
        <Link to="/contact-us"><li  className='hidden sm:inline  text-slate-700 hover:underline hover:bg-slate-300' >Contact-Us</li></Link>
        <Link to="/profile">
        {currentUser ? (
    <img  className='rounded-full h-7 w-7 object-cover'src = {currentUser.avatar} alt='Profile'/>
        ): 
        (<li className=' sm:inline  text-slate-700 hover:underline hover:bg-slate-300' >Sign In</li>)}
        
        </Link>
      
      
       
      </ul>
 
        </div>
        </header>
     
  )
}
