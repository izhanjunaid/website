"use client";

import BlogSection from "@/components/BlogSection";
import Category from "@/components/Category";
import Feature from "@/components/Feature";
import Hero from "@/components/Hero";
import NewArrival from "@/components/NewArrival";
import { useContext } from "react";
import { AppContext } from "./app";

export default function Home() {
  const { setShowVirtualMakeup } = useContext(AppContext);

  return (
    <main>
      <Hero setShowVirtualMakeup={setShowVirtualMakeup} />
      <Feature />
      <NewArrival />
      <Category />
      <BlogSection />
    </main>
  );
}
