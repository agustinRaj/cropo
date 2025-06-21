"use client";
import { useState } from "react";
import { auth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#2d2320] via-[#fff7f0] to-[#3d2320]">
      <div className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#2d2320] drop-shadow mb-2 animate-fade-in">
          Welcome to Cropo!
        </h1>
        <p className="text-lg sm:text-xl text-[#3d2320] font-medium animate-fade-in-slow">
          Secure, simple passport photo cropping and upload.
        </p>
      </div>
      <form
        onSubmit={handleLogin}
        className="bg-[#2d2320] p-8 rounded-xl shadow w-full max-w-md space-y-6 border border-peach/30"
      >
        <h2 className="text-3xl font-bold mb-4 text-center text-peach-dark">
          Login
        </h2>
        <input
          type="email"
          placeholder="Email address"
          autoComplete="username"
          className="w-full px-4 py-3 border border-peach-dark bg-[#fff7f0] text-[#2d2320] rounded focus:outline-none focus:ring-2 focus:ring-peach-dark transition placeholder-peach-dark text-base"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          className="w-full px-4 py-3 border border-peach-dark bg-[#fff7f0] text-[#2d2320] rounded focus:outline-none focus:ring-2 focus:ring-peach-dark transition placeholder-peach-dark text-base"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && (
          <div className="text-red-400 text-sm text-center">{error}</div>
        )}
        <button
          type="submit"
          className="w-full bg-peach-dark hover:bg-peach text-white font-semibold py-3 rounded transition"
        >
          Login
        </button>
        <p className="text-sm text-center mt-2 text-peach-dark">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-peach-dark hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
