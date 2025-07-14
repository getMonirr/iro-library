import { SearchBar } from "@/components/common/SearchBar";
import { Categories } from "@/components/home/Categories";
import { FeaturedBooks } from "@/components/home/FeaturedBooks";
import { Hero } from "@/components/home/Hero";
import { PopularBooks } from "@/components/home/PopularBooks";
import { Stats } from "@/components/home/Stats";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main>
        <Hero />
        <SearchBar />
        <Stats />
        <FeaturedBooks />
        <PopularBooks />
        <Categories />
      </main>
      <Footer />
    </div>
  );
}
