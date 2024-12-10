import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import OAuth from '../Components/OAuth';
export default function Signup() {
  const [formdata,setformdata] = useState({})
  const [error,setError] = useState(null);
  const [loading,setLoading]= useState(false);
  const navigate = useNavigate();
  const handlechange = (e) =>{
  setformdata(
    {
      ...formdata,
      [e.target.id]: e.target.value,
    }
  )
  };
  const handlesubmit = async (e)=>{
    e.preventDefault();
    try{
      setLoading(true);
      const res = await fetch('/api/auth/signup',
        {
                method:"POST",
                headers:{
                  'Content-Type':'application/json',
                },
                body:JSON.stringify(formdata),
        }
      );
      const data = await res.json();
      console.log(data);
      if(data.success === false){
        setLoading(false);
        setError(data.message);
       
        return;
  
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    }catch (error){
    setLoading(false);
    setError(error.message);
    }
   
  }
  
  
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handlesubmit}
      className="flex flex-col gap-4">
        <input type="text"
         placeholder="Username" 
         className="border p-3 rounded-lg" 
         id="username" 
        onChange={handlechange}/>

        <input type="email"
         placeholder="E-mail" 
         className="border p-3 rounded-lg" 
         id="email"
         onChange={handlechange}
          />
        <input type="password"
         placeholder="Password"
          className="border p-3 rounded-lg"
           id="password"
           onChange={handlechange}
            />
        <button  disabled={loading }className="bg-slate-700 text-white p-3 hover:opacity-95 disabled:opacity-80">
          {loading ?'Loading...':'sign Up'}
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700">Sign In</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}
