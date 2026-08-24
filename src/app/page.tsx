import { Hero } from "@/components/home/Hero";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { ProductGridSection } from "@/components/ProductGridSection";
import { ShopByBudget } from "@/components/home/ShopByBudget";
import { FestivalCollections } from "@/components/home/FestivalCollections";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { CustomerReviews } from "@/components/home/CustomerReviews";
import { InstagramGallery } from "@/components/home/InstagramGallery";
import { Newsletter } from "@/components/home/Newsletter";
import { getBestsellers, getProducts, getTrending } from "@/lib/supabase/queries";

export default async function Home() {
  const [trendingRaw, bestsellersRaw, allProducts] = await Promise.all([
    getTrending(8),
    getBestsellers(8),
    getProducts(),
  ]);
  const trending = trendingRaw.length ? trendingRaw : allProducts.slice(0, 8);
  const bestsellers = bestsellersRaw.length ? bestsellersRaw : allProducts.slice(8, 16);

  return (
    <>
      <Hero />
      <FeaturedCategories />
      <ProductGridSection
        eyebrow="Right now"
        title="Trending Products"
        description="What guests and gifters are loving this season."
        products={trending}
        viewAllHref="/shop"
        tinted
      />
      <ShopByBudget />
      <ProductGridSection
        eyebrow="Customer favorites"
        title="Best Sellers"
        description="Our most-gifted pieces, reordered again and again."
        products={bestsellers}
        viewAllHref="/shop"
      />
      <FestivalCollections />
      <WhyChooseUs />
      <CustomerReviews />
      <InstagramGallery />
      <Newsletter />
    </>
  );
}
