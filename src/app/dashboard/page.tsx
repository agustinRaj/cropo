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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-xl mx-auto bg-white rounded shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Welcome, {profile?.name || user?.email}
          </h2>
          <button onClick={handleLogout} className="btn btn-sm btn-secondary">
            Logout
          </button>
        </div>
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Profile Info</h3>
          <div>Email: {user?.email}</div>
          <div>Name: {profile?.name}</div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Upload & Crop Passport Photo</h3>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-2"
          />
          {imageUrl && (
            <div>
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
                  style={{ maxWidth: 300, maxHeight: 400 }}
                />
              </ReactCrop>
              <button
                className="btn btn-primary mt-2"
                onClick={handleCropComplete}
                type="button"
              >
                Crop & Upload
              </button>
            </div>
          )}
          {croppedImage && (
            <div className="mt-4">
              <h4 className="font-semibold">Cropped Passport Photo:</h4>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={croppedImage}
                alt="Cropped"
                className="border mt-2"
                style={{ width: 140, height: 180 }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
