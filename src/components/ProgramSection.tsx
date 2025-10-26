import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, TrendingUp, Coins } from "lucide-react";

const programs = [
  {
    icon: Shield,
    title: "Pengawalan Anggaran Multi-Sektor",
    description: "Mengawal dan memastikan setiap rupiah APBD di sektor ekonomi dialokasikan secara adil, transparan, dan tepat sasaran. Fokus utama pada anggaran untuk program yang langsung menyentuh hajat hidup rakyat, seperti pertanian, UMKM, dan koperasi.",
  },
  {
    icon: TrendingUp,
    title: "Pengawasan BUMD & PAD",
    description: "Melakukan pengawasan ketat agar BUMD bekerja profesional, memberikan pelayanan prima, dan menghasilkan keuntungan (PAD) untuk daerah. Pendapatan daerah yang kuat adalah kunci untuk membiayai pembangunan.",
  },
  {
    icon: Coins,
    title: "Optimalisasi PAD",
    description: "Memastikan pendapatan asli daerah (PAD), seperti pajak dan retribusi, dikelola secara jujur dan adil. Pendapatan yang optimal adalah bahan bakar utama untuk membiayai program pembangunan, mulai dari jalan, sekolah, hingga kesehatan.",
  },
];

export const ProgramSection = () => {
  return (
    <section id="program" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-center bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            Program Unggulan
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-center font-medium italic">
            Program kerja yang dirancang untuk membawa perubahan nyata dan meningkatkan 
            kesejahteraan masyarakat
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => {
            const Icon = program.icon;
            return (
              <div
                key={program.title}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card className="h-full shadow-card-custom hover:shadow-card-hover-custom transition-smooth hover:-translate-y-2 cursor-pointer">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{program.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-justify leading-relaxed">{program.description}</p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
