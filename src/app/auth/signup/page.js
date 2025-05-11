// we will use this page to signup the user
'use client' // by default, components are only server-side (meaning you cannot use anything like onClick etc since that stuff is all client-side). in-order to use client-side stuff, you need to add 'use client' at the top of the file. this is supposed to be the signup page so obviously, we will probably use forms etc and client-side stuff will be needed.

  import { useState } from 'react'; //react is just a library/package that is installed by default when we make a nextjs app, just like time or random in python. useState is called a hook, and a hook is simply a special type of react function (if a function has 'use' in its name then its a hook), it lets you 'hook in' to react's features from your component. so all we did is import a special function from a library.

  // as for what does useState do, well its a function, so it accepts arguments and returns a value. it accepts 1 args, it is the initial value of the state (think of state as a local variable that is only accessible in this component). and useState returns an array with 2 values, the first will be the value of the state (in the first render, it will just be the arg you passed) and the second is a function that will be used to update the value of the state (we will call this function and it will change the value of the state and as soon as the value of the state changes, react will re-render the component and show the new value of the state in the UI).

  import Image from 'next/image'; // again, next is a library/package and we import Image from it which is a built-in component that is used to display images, its just like the img tag from html but much more optimized so its recommended to use this component instead of img tag.

  import Link from 'next/link'; // Link is a built-in component that is used to create links in nextjs. it is just like the a (anchor tag) tag from html but much more optimized so its recommended to use this component instead of a tag. it also has some extra features like prefetching and client-side navigation which makes it faster than the a tag.


import Divider from '../../components/orDivider';
import PasswordInput from '../../components/passwordInput'; 
import GoogleIcon from '../../components/googleIcon';



  const globeGirl = '/Assets/globe-girl.gif'






  export default function SignupPage() {  // ok, this is a simple JS function that we make normally, it just has 2 new keywords, export and default.
  // export is used to let this function be used in other files (it can basically be exported to other files) and default is used to let this function be renamed (meaning we won't have to use that {} and then write the name in there, we can name it anything we want when we export). there can only be one default function in a file. whichever function is the default, that is the main thing of the file.

    const [username, setUsername] = useState(''); // so here we give initial value of our state as '' and that is returned and stored in the first part of the array called username
    //So, useState('') takes '' as input (the initial value) and returns the array [current state value, state updater function].
    const [email, setEmail] = useState('');
    
      const [password, setPassword] = useState(''); 
      const [confirmPassword, setConfirmPassword] = useState(''); 





    const handleSignup = (e) => { 
      // const handleSignup is just a variable but we initialize it with a function. the () are the function parameters, the e in the () is the event object (just like in those forms that we made in lab 9 and 10). the => is just used to separate the function name from the function body which is in the {}.

      e.preventDefault(); // like normal, we do event.preventDefault() to prevent the default behavior of the form (which is to refresh the page). this is just like how we did it in lab 9 and 10.
      console.log('Creating account with:', { username, email });
      // Here you would typically call an API to create the user
    };

    return (
      <div className="h-screen w-screen flex overflow-hidden" style={{ background: 'linear-gradient(90deg, #0085FF 24%, #003465 100%)' }}>
        <div className="w-1/2 flex items-center justify-center">
          <Image 
            src={globeGirl} 
            alt="globe girl" 
            width={500} 
            height={500} 
            className="object-contain" 
          />
        </div>
        <div className='w-1/2 flex items-center justify-center'>
          <form onSubmit={handleSignup} className='w-screen flex items-center justify-center flex-col'>
            <h1 className='font-bold text-[50px] text-white' >
            Sign Up
            </h1>
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="w-[450px] h-[48px] mt-10 bg-white placeholder:text-gray-500 text-black rounded-md px-4" 
            />
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-[450px] h-[48px] mt-6 bg-white placeholder:text-gray-500 text-black rounded-md px-4"
            />
          {/* we will make a div, we will have an input and a btn in that div. the btn will be the eye we imported from lucide-react. but the eye is inside the input field so we will make the entire div relative and the btn absolute. this logic is in the passwordInput.js file in components folder.*/}
          <div className="relative w-[450px] mt-6">
            <PasswordInput placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <div className='relative w-[450px] mt-6'>
            <PasswordInput placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
          </div>
            <button
            className="w-[450px] h-[62px] mt-6 bg-[#181E5F] text-white rounded-md px-4">
            Sign Up
            </button>
            <p className='text-white mt-4'>Already have an account? <Link href="/login" className='text-white underline'>Log In</Link></p>
            <p className='text-white mt-4'>By signing up, you agree to our <Link href="/terms" className='text-white underline'>Terms of Service</Link> and <Link href="/privacy" className='text-white underline'>Privacy Policy</Link>.</p>
            <p className='text-white mt-4'>We promise not to share your information with the aliens.</p>
            <Divider />
            <button
            className="w-[450px] h-[62px] bg-white text-gray-700 rounded-md flex items-center justify-center font-medium">
              <GoogleIcon />
              <span className="ml-2">Continue with Google</span>
            </button>
          </form>
        </div>
  </div>
    );
  }
