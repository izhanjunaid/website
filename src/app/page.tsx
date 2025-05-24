import BlogSection from "@/components/BlogSection";
import Category from "@/components/Category";
import Feature from "@/components/Feature";
import Hero from "@/components/Hero";
import NewArrival from "@/components/NewArrival";
import GlobalMakeupFeature from "@/components/GlobalMakeupFeature";

export default function Home() {
  return (
    <main>
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <GlobalMakeupFeature />
      </div>
      <Feature />
      <NewArrival />
      <Category />
      <BlogSection />
    </main>
  );
}
