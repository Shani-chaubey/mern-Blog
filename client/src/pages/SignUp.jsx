import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData , setFormData] = useState({username: "", password:"", email:""});
  const [errorMessage, setErrorMessage] = useState(null);
  const [ loading, setLoading ] = useState(null);

  const handleChange = (e)=>{
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }
  const handleSubmit = async (e)=>{
    e.preventDefault();
    if( !formData.username || !formData.password || !formData.email ){
      return setErrorMessage("Please Fill all the details");
    }
    try {
      setErrorMessage(null)
      setLoading(true);
      const res = await fetch('/api/auth/signup',{
        method : "POST",
        headers:{ "Content-Type":"application/json"},
        body: JSON.stringify(formData)  
      })
      const data = await res.json();
      if(data.success === false){
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if(res.ok){
       navigate('/signIn')
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  }
  console.log(formData)
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <Link
            to="/"
            className="font-bold dark:text-white text-4xl"
          >
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Himanshu's 
            </span>
            Blogs
          </Link>
          <p className="text-sm mt-5">Welcome to the Sign Up Page</p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your Username"></Label>
              <TextInput type="text" placeholder="Username" id="username" onChange={handleChange} />
            </div>
            <div>
              <Label value="Your Email"></Label>
              <TextInput type="email" placeholder="example@gmail.com" id="email" onChange={handleChange} />
            </div>
            <div>
              <Label value="Your Password"></Label>
              <TextInput type="password" placeholder="Password" id="password" onChange={handleChange} />
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
              {
                loading ? 
                <>
                  <Spinner size='sm'></Spinner>
                  <span className="pl-3">Loading...</span>
                </>
                 : 'Signup'
              }
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Already have an Account?</span>
            <Link to='/signIn' className="text-blue-600 cursor-pointer">Sign In</Link>
          </div>
          { errorMessage && <Alert className="mt-5" color='failure'>
            {errorMessage}
          </Alert>}
        </div>
      </div> 
    </div>
  );
}
