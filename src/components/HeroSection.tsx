import { Button } from "@/components/ui/button";
import heroImage from "@/assets/new hero section.png";
import { ArrowRight } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden gradient-subtle">
      <div className="container mx-auto px-4 sm:px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
              <span className="text-sm font-semibold text-primary">
                Fraksi PKB
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Bersama{" "}
              <span className="text-primary">Setiya Utama</span>
              <br />
              Mewujudkan Perubahan Nyata
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl">
              Mengabdi dari Hati, Ekonomi Blora Berdikari. Mari berjuang bersama 
              untuk masa depan yang lebih baik bagi kita semua.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="hero" asChild className="group">
                <a href="#berita">
                  Lihat Berita & Kegiatan Terbaru
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#profil">Profil Saya</a>
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative z-10">
              <img
                src={heroImage}
                alt="Setiya Utama - Politisi PKB"
                className="w-full max-w-md mx-auto rounded-3xl shadow-2xl object-cover"
              />
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-8 -right-8 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-accent/20 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-background" style={{
        clipPath: "polygon(0 100%, 100% 100%, 100% 0, 50% 20%, 0 0)"
      }}></div>
    </section>
  );
};
