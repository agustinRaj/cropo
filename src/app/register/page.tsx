"use client";
import { useState } from "react";
import { auth, db } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // Basic validation
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== retypePassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email,
        name,
        createdAt: new Date().toISOString(),
      });
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "code" in err &&
        (err as { code?: string }).code === "auth/email-already-in-use"
      ) {
        setError("Email already in use");
      } else {
        setError("");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#2d2320] via-[#fff7f0] to-[#3d2320]">
      <div className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#2d2320] drop-shadow mb-2 animate-fade-in">
          Create your Cropo account
        </h1>
        <p className="text-lg sm:text-xl text-[#3d2320] font-medium animate-fade-in-slow">
          Register to securely crop and store your passport photos.
        </p>
      </div>
      <form
        onSubmit={handleRegister}
        className="bg-[#2d2320] p-10 rounded-xl shadow-2xl w-full max-w-md space-y-6 border border-peach/30"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-peach-dark">
          Register
        </h2>
        <input
          type="text"
          placeholder="Full Name (as per passport)"
          className="w-full px-5 py-3 border border-peach-dark bg-[#fff7f0] text-[#2d2320] rounded focus:outline-none focus:ring-2 focus:ring-peach-dark transition placeholder-peach-dark text-base"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email address"
          className="w-full px-5 py-3 border border-peach-dark bg-[#fff7f0] text-[#2d2320] rounded focus:outline-none focus:ring-2 focus:ring-peach-dark transition placeholder-peach-dark text-base"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
        />
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            className="w-full px-5 py-3 border border-peach-dark bg-[#fff7f0] text-[#2d2320] rounded focus:outline-none focus:ring-2 focus:ring-peach-dark transition placeholder-peach-dark text-base pr-12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-peach-dark text-sm focus:outline-none"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Retype password"
            className="w-full px-5 py-3 border border-peach-dark bg-[#fff7f0] text-[#2d2320] rounded focus:outline-none focus:ring-2 focus:ring-peach-dark transition placeholder-peach-dark text-base pr-12"
            value={retypePassword}
            onChange={(e) => setRetypePassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        {error && (
          <div className="text-red-400 text-sm text-center">{error}</div>
        )}
        {success && (
          <div className="text-green-400 text-sm text-center font-semibold">
            {success}
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-peach-dark hover:bg-peach text-white font-semibold py-3 rounded transition"
        >
          Register
        </button>
        <p className="text-sm text-center mt-2 text-peach-dark">
          Already have an account?{" "}
          <a href="/login" className="text-peach-dark hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
