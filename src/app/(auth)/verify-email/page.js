export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#09090B] text-white px-4 py-6">
      <div className="min-w-[50%] w-full max-w-sm text-center">
        <h1 className="text-2xl font-semibold mb-4">Verify Your Email</h1>
        <p className="text-gray-400 mb-6">
          We have sent a verification link to your email address. Please check your inbox and click the link to verify your account.
        </p>
        <p className="text-gray-400">
          Once verified, you can <a href="/auth/signin" className="text-[#5529C9] hover:underline">sign in</a> to your account.
        </p>
      </div>
    </main>
  );
}
