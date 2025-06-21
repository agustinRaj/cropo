import Image from "next/image";
import Login from "./login/page";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-8 pb-20 gap-16 sm:p-20 font-sans bg-gray-50">
      <header className="w-full flex justify-center items-center py-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Passport Photo Cropper
        </h1>
      </header>
      <main className="flex flex-col items-center justify-center w-full max-w-md mx-auto bg-white shadow-lg rounded-lg p-8">
        <Login />
      </main>
      <footer className="w-full flex justify-center items-center py-2 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Cropo. All rights reserved.
      </footer>
    </div>
  );
}
