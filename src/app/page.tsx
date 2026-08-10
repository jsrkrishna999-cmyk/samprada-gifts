import { Hero } from "@/components/home/Hero";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { ProductGridSection } from "@/components/ProductGridSection";
import { ShopByBudget } from "@/components/home/ShopByBudget";
import { FestivalCollections } from "@/components/home/FestivalCollections";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { CustomerReviews } from "@/components/home/CustomerReviews";
import { InstagramGallery } from "@/components/home/InstagramGallery";
import { Newsletter } from "@/components/home/Newsletter";
import { getBestsellers, getTrending, products } from "@/lib/data/products";

export default function Home() {
  const trending = getTrending(8).length ? getTrending(8) : products.slice(0, 8);
  const bestsellers = getBestsellers(8).length ? getBestsellers(8) : products.slice(8, 16);

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
