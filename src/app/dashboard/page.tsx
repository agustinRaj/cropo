"use client";
import { useEffect, useState } from "react";
import { auth, db, storage } from "@/firebase";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export default function Dashboard() {
  const [user, setUser] = useState<import("firebase/auth").User | null>(null);
  const [profile, setProfile] = useState<{
    name?: string;
    email?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 10,
    y: 10,
    width: 40,
    height: 51.43, // 35/45 aspect ratio
  });
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [cropImageRef, setCropImageRef] = useState<HTMLImageElement | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        setProfile(docSnap.exists() ? docSnap.data() : null);
      } else {
        router.push("/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageUrl(URL.createObjectURL(e.target.files[0]));
      setCroppedImage(null);
    }
  };

  const getCroppedImg = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!cropImageRef || !crop.width || !crop.height) return resolve(null);
      const canvas = document.createElement("canvas");
      const scaleX = cropImageRef.naturalWidth / cropImageRef.width;
      const scaleY = cropImageRef.naturalHeight / cropImageRef.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(null);
      ctx.drawImage(
        cropImageRef,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    });
  };

  const handleCropComplete = async () => {
    const blob = await getCroppedImg();
    if (blob) {
      const url = URL.createObjectURL(blob);
      setCroppedImage(url);
      // Upload to Firebase Storage
      const storageRef = ref(storage, `passport_photos/${user?.uid}.jpg`);
      await uploadBytes(storageRef, blob);
      alert("Passport photo uploaded!");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen h-full bg-gradient-to-r from-[#2d2320] via-[#fff7f0] to-[#3d2320] px-2 sm:px-4 md:px-8">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-[#1a1412] via-[#2d2320] to-[#3d2320] bg-opacity-95 shadow-lg flex flex-wrap md:flex-nowrap flex-row items-center justify-between px-2 sm:px-8 py-3 z-30 border-b border-peach/30 backdrop-blur-md">
        <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0 min-w-0">
          <span className="flex items-center gap-2 text-2xl font-extrabold text-peach tracking-tight drop-shadow whitespace-nowrap">
            <svg
              className="w-8 h-8 text-peach-dark"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="#f5e4d6"
              />
              <path
                d="M8 12h8M12 8v8"
                stroke="#e48b6b"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Cropo
          </span>
        </div>
        <div className="flex-1 flex justify-center items-center min-w-0">
          <div className="flex gap-1 sm:gap-4 md:gap-8 w-full justify-center">
            <a
              href="/dashboard"
              className="text-peach hover:text-white font-semibold px-3 sm:px-5 py-2 rounded shadow-sm hover:shadow-lg transition-colors duration-200 hover:bg-peach-dark focus:outline-none focus:ring-2 focus:ring-peach-dark whitespace-nowrap focus:bg-peach-dark focus:text-white"
            >
              Home
            </a>
            <a
              href="#services"
              className="text-peach hover:text-white font-semibold px-3 sm:px-5 py-2 rounded shadow-sm hover:shadow-lg transition-colors duration-200 hover:bg-peach-dark focus:outline-none focus:ring-2 focus:ring-peach-dark whitespace-nowrap focus:bg-peach-dark focus:text-white"
            >
              Services
            </a>
            <a
              href="#contact"
              className="text-peach hover:text-white font-semibold px-3 sm:px-5 py-2 rounded shadow-sm hover:shadow-lg transition-colors duration-200 hover:bg-peach-dark focus:outline-none focus:ring-2 focus:ring-peach-dark whitespace-nowrap focus:bg-peach-dark focus:text-white"
            >
              Contact
            </a>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 min-w-0">
          <span className="font-semibold text-gray-100 bg-peach/30 px-2 sm:px-3 py-1 rounded-full shadow-sm text-xs sm:text-base flex items-center gap-2 max-w-[140px] sm:max-w-xs truncate">
            <svg
              className="w-5 h-5 text-peach-dark"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="truncate">{profile?.name || user?.email}</span>
          </span>
          <button
            onClick={handleLogout}
            className="bg-peach text-peach-dark px-3 sm:px-5 py-2 rounded-lg font-bold shadow-md hover:bg-peach-dark hover:text-white border-2 border-peach-dark focus:outline-none focus:ring-2 focus:ring-peach-dark transition duration-200 text-xs sm:text-base flex items-center gap-2 group"
          >
            <svg
              className="w-5 h-5 text-peach-dark group-hover:text-white transition"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7"
              />
            </svg>
            Logout
          </button>
        </div>
      </nav>
      <div className="pt-[76px]" />
      <div className="max-w-xl w-full min-h-[calc(100vh-120px)] mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-8 mt-6 sm:mt-10 border border-peach/20 flex flex-col justify-start">
        <div className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#2d2320] drop-shadow mb-2 animate-fade-in">
            Welcome, {profile?.name || user?.email}!
          </h1>
          <p className="text-lg sm:text-xl text-[#3d2320] font-medium animate-fade-in-slow">
            Manage your passport photos securely and easily.
          </p>
        </div>
        <div className="mb-8">
          <h3 className="font-semibold mb-3 text-lg sm:text-xl text-peach-dark flex items-center gap-2">
            <svg
              className="w-5 sm:w-6 h-5 sm:h-6 text-peach-dark"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Profile Info
          </h3>
          <div className="mb-1 text-gray-700 text-sm sm:text-base">
            Email:{" "}
            <span className="font-mono text-peach-dark break-all">
              {user?.email}
            </span>
          </div>
          <div className="mb-1 text-gray-700 text-sm sm:text-base">
            Name:{" "}
            <span className="font-mono text-peach-dark break-all">
              {profile?.name}
            </span>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-3 text-base sm:text-lg text-peach-dark flex items-center gap-2">
            <svg
              className="w-4 sm:w-5 h-4 sm:h-5 text-peach-dark"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10l4.553-2.276A2 2 0 0020 6.382V5a2 2 0 00-2-2H6a2 2 0 00-2 2v1.382a2 2 0 00.447 1.342L9 10m6 0v10m0 0a2 2 0 01-2 2H9a2 2 0 01-2-2V10m9 10V10m0 0l-6-4"
              />
            </svg>
            Upload & Crop Passport Photo
          </h3>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-3 block w-full text-xs sm:text-sm text-gray-600 file:mr-2 sm:file:mr-4 file:py-2 file:px-3 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-peach file:text-peach-dark hover:file:bg-peach-dark hover:file:text-white transition"
          />
          {imageUrl && (
            <div className="bg-gray-50 border border-peach/20 rounded-lg p-2 sm:p-4 flex flex-col items-center">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                aspect={35 / 45}
                minWidth={140}
                minHeight={180}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="To crop"
                  ref={(el) => setCropImageRef(el)}
                  className="rounded shadow max-w-[180px] sm:max-w-xs max-h-60 sm:max-h-96 border border-peach/30"
                />
              </ReactCrop>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 w-full justify-center">
                <button
                  className="bg-peach text-peach-dark px-4 sm:px-6 py-2 rounded-lg font-bold shadow-md hover:bg-peach-dark hover:text-white border-2 border-peach-dark focus:outline-none focus:ring-2 focus:ring-peach-dark transition duration-200 text-xs sm:text-base flex items-center gap-2 group"
                  onClick={handleCropComplete}
                  type="button"
                >
                  <svg
                    className="w-5 h-5 text-peach-dark group-hover:text-white transition"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Crop & Upload
                </button>
                <button
                  className="bg-gray-200 text-gray-700 px-4 sm:px-6 py-2 rounded-lg font-bold shadow-md hover:bg-gray-300 hover:text-peach-dark border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-peach-dark transition duration-200 text-xs sm:text-base flex items-center gap-2 group"
                  type="button"
                  onClick={() => {
                    setImageUrl(null);
                    setCroppedImage(null);
                    setCropImageRef(null);
                  }}
                >
                  <svg
                    className="w-5 h-5 text-gray-700 group-hover:text-peach-dark transition"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Load Another Photo
                </button>
              </div>
            </div>
          )}
          {croppedImage && (
            <div className="mt-6 flex flex-col items-center">
              <h4 className="font-semibold text-peach-dark text-sm sm:text-base">
                Cropped Passport Photo:
              </h4>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={croppedImage}
                alt="Cropped"
                className="border-2 border-peach-dark mt-2 rounded shadow"
                style={{ width: 140, height: 180 }}
              />
            </div>
          )}
        </div>
      </div>
      {/* Services Section */}
      <section
        id="services"
        className="max-w-3xl w-full mx-auto mt-10 sm:mt-16 mb-6 sm:mb-8 p-4 sm:p-8 bg-white rounded-2xl shadow-xl border border-peach/20"
      >
        <h2 className="text-xl sm:text-2xl font-extrabold mb-4 text-peach-dark flex items-center gap-2">
          <svg
            className="w-5 sm:w-6 h-5 sm:h-6 text-peach-dark"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 17v-2a4 4 0 014-4h2a4 4 0 014 4v2M7 7a4 4 0 110-8 4 4 0 010 8z"
            />
          </svg>
          Our Services
        </h2>
        <ul className="list-disc pl-5 sm:pl-8 text-gray-700 space-y-2 text-base sm:text-lg">
          <li>Passport-size photo upload, crop, and download</li>
          <li>Automatic aspect ratio and size enforcement</li>
          <li>Secure cloud storage for your photos</li>
          <li>Easy-to-use interface for all devices</li>
          <li>Privacy-focused: your data is safe and never shared</li>
          <li>24/7 support for all users</li>
        </ul>
      </section>
      {/* Contact Section */}
      <section
        id="contact"
        className="max-w-3xl w-full mx-auto mb-10 sm:mb-16 p-4 sm:p-8 bg-white rounded-2xl shadow-xl border border-peach/20"
      >
        <h2 className="text-xl sm:text-2xl font-extrabold mb-4 text-peach-dark flex items-center gap-2">
          <svg
            className="w-5 sm:w-6 h-5 sm:h-6 text-peach-dark"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 10.5a8.38 8.38 0 01-1.9.7c-.5.1-.7-.2-.7-.5v-1.1c0-.3.2-.6.5-.7a8.5 8.5 0 00-7.6 0c.3.1.5.4.5.7v1.1c0 .3-.2.6-.7.5a8.38 8.38 0 01-1.9-.7c-.3-.2-.4-.6-.2-.9a8.5 8.5 0 0115.8 0c.2.3.1.7-.2.9z"
            />
          </svg>
          Contact Us
        </h2>
        <p className="mb-3 text-gray-700 text-base sm:text-lg">
          Have questions or need help? Reach out to our support team:
        </p>
        <ul className="text-gray-700 text-base sm:text-lg">
          <li>
            Email:{" "}
            <a
              href="mailto:support@cropo.com"
              className="text-peach-dark hover:underline"
            >
              support@cropo.com
            </a>
          </li>
          <li>
            Phone:{" "}
            <a
              href="tel:+1234567890"
              className="text-peach-dark hover:underline"
            >
              +1 234 567 890
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
