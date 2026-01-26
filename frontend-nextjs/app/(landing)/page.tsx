import ImageCarousel from "@/components/images/image-carousel";
import CallToActionSection from "@/components/landing/call-to-action-section";
import HeroSection from "@/components/landing/hero-section";
import { carouselImages } from "@/assets/carousel";
import { RedirectIfLoggedIn } from "@/components/auth/Redirect";

export default function LandingPage() {
  return (
    <main style={{ width: "100%", padding: "0" }}>
      <RedirectIfLoggedIn />
      <HeroSection
        leftSlot={<CallToActionSection />}
        rightSlot={
          <ImageCarousel
            items={carouselImages}
            autoplay
            autoplaySpeed={5000}
            effect="fade"
          />
        }
      />
    </main>
  );
}
