import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center" 
         style={{ background: 'linear-gradient(90deg, #0085FF 24%, #003465 100%)' }}>
      <h1 className="text-5xl font-bold text-white mb-8">Welcome to Quiver</h1>
      <h2 className="text-2xl text-white mb-12">Aim, Note, Navigate</h2>
      
      <div className="flex space-x-6">
        <Link href="/auth/signup" 
              className="px-8 py-3 bg-white text-[#003465] font-medium rounded-lg 
                        hover:bg-opacity-90 transition-all">
          Sign Up
        </Link>
        <Link href="/auth/signin" 
              className="px-8 py-3 border-2 border-white text-white font-medium rounded-lg 
                        hover:bg-white hover:bg-opacity-10 transition-all">
          Sign In
        </Link>
      </div>
    </div>
  );
}