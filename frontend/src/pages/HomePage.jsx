"use client";

export default function HomePage() {
  const googleUser = JSON.parse(localStorage.getItem("googleUser"));

  if (!googleUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Welcome to SmartBook!</h1>
        <p className="text-gray-600">Please login with Google to continue.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Welcome, {googleUser.name}!</h1>
      <p className="text-gray-600 mb-4">{googleUser.email}</p>
      <img src={googleUser.picture} alt="Profile" className="w-32 h-32 rounded-full" />
    </div>
  );
}
