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
    <div className="min-h-screen bg-gradient-to-br from-[#2d2320] via-[#fff7f0] to-[#3d2320]">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-[#2d2320] via-[#3d2320] to-[#fff7f0] bg-opacity-95 shadow-lg flex items-center justify-between px-8 py-4 sticky top-0 z-20 border-b border-peach/30 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <span className="text-2xl font-extrabold text-peach tracking-tight drop-shadow">
            Cropo
          </span>
          <a
            href="/dashboard"
            className="text-gray-100 hover:text-peach font-semibold px-4 py-2 rounded transition-colors duration-200 hover:bg-peach/10"
          >
            Home
          </a>
          <a
            href="#services"
            className="text-gray-100 hover:text-peach font-semibold px-4 py-2 rounded transition-colors duration-200 hover:bg-peach/10"
          >
            Services
          </a>
          <a
            href="#contact"
            className="text-gray-100 hover:text-peach font-semibold px-4 py-2 rounded transition-colors duration-200 hover:bg-peach/10"
          >
            Contact
          </a>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-semibold text-gray-100 bg-peach/30 px-3 py-1 rounded-full shadow-sm">
            {profile?.name || user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="bg-peach-dark text-white px-5 py-2 rounded-lg font-bold shadow hover:bg-peach transition duration-200"
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-10 border border-peach/20">
        <div className="mb-8">
          <h3 className="font-semibold mb-3 text-xl text-peach-dark flex items-center gap-2">
            <svg
              className="w-6 h-6 text-peach-dark"
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
          <div className="mb-1 text-gray-700">
            Email:{" "}
            <span className="font-mono text-peach-dark">{user?.email}</span>
          </div>
          <div className="mb-1 text-gray-700">
            Name:{" "}
            <span className="font-mono text-peach-dark">{profile?.name}</span>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-3 text-lg text-peach-dark flex items-center gap-2">
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
                d="M15 10l4.553-2.276A2 2 0 0020 6.382V5a2 2 0 00-2-2H6a2 2 0 00-2 2v1.382a2 2 0 00.447 1.342L9 10m6 0v10m0 0a2 2 0 01-2 2H9a2 2 0 01-2-2V10m9 10V10m0 0l-6-4"
              />
            </svg>
            Upload & Crop Passport Photo
          </h3>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-3 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-peach file:text-peach-dark hover:file:bg-peach-dark hover:file:text-white transition"
          />
          {imageUrl && (
            <div className="bg-gray-50 border border-peach/20 rounded-lg p-4 flex flex-col items-center">
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
                  className="rounded shadow max-w-xs max-h-96 border border-peach/30"
                />
              </ReactCrop>
              <div className="flex gap-4 mt-4">
                <button
                  className="bg-peach-dark text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-peach transition duration-200"
                  onClick={handleCropComplete}
                  type="button"
                >
                  Crop & Upload
                </button>
                <button
                  className="bg-gray-700 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-gray-900 transition duration-200"
                  type="button"
                  onClick={() => {
                    setImageUrl(null);
                    setCroppedImage(null);
                    setCropImageRef(null);
                  }}
                >
                  Load Another Photo
                </button>
              </div>
            </div>
          )}
          {croppedImage && (
            <div className="mt-6 flex flex-col items-center">
              <h4 className="font-semibold text-peach-dark">
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
        className="max-w-3xl mx-auto mt-16 mb-8 p-8 bg-white rounded-2xl shadow-xl border border-peach/20"
      >
        <h2 className="text-2xl font-extrabold mb-4 text-peach-dark flex items-center gap-2">
          <svg
            className="w-6 h-6 text-peach-dark"
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
        <ul className="list-disc pl-8 text-gray-700 space-y-2 text-lg">
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
        className="max-w-3xl mx-auto mb-16 p-8 bg-white rounded-2xl shadow-xl border border-peach/20"
      >
        <h2 className="text-2xl font-extrabold mb-4 text-peach-dark flex items-center gap-2">
          <svg
            className="w-6 h-6 text-peach-dark"
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
        <p className="mb-3 text-gray-700 text-lg">
          Have questions or need help? Reach out to our support team:
        </p>
        <ul className="text-gray-700 text-lg">
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
