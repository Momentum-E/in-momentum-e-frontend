"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";

import { useAuthStore } from "@/stores/authStore";

import fleetImg from "@/public/abcd.jpg";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

interface AuthStore {
  isAuthenticated: boolean;
}

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated } = useAuthStore() as AuthStore;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Image
          src={fleetImg}
          width={2400}
          height={600}
          alt="Fleet picture"
          priority
        />
      </div>
      <Footer />
    </div>
  );
}
