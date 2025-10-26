import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const achievements = [
  "Anggota Komisi B DPRD Kabupaten Blora",
  "Fokus pada pengembangan ekonomi daerah dan UMKM",
  "Pengawas kinerja dinas-dinas ekonomi dan BUMD",
  "Pelopor program pemberdayaan ekonomi masyarakat",
];

export const ProfileSection = () => {
  return (
    <section id="profil" className="py-20 gradient-subtle">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-center bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Profil Singkat
            </h2>
            <p className="text-lg text-muted-foreground text-center font-medium italic">
              Dedikasi dan pengabdian untuk rakyat
            </p>
          </div>

          <Card className="shadow-card-custom animate-fade-in">
            <CardContent className="p-8">
              <p className="text-foreground leading-relaxed mb-8 text-justify text-lg font-medium">
                Setiya Utama adalah anggota Komisi B DPRD Kabupaten Blora Fraksi PKB yang mengemban 
                tanggung jawab penting dalam tiga fungsi dasar DPRD: Legislasi, Anggaran, 
                dan Pengawasan di bidang ekonomi. Dengan motto <span className="text-primary font-semibold italic">"Mengabdi dari Hati, Ekonomi 
                Blora Berdikari"</span>, berkomitmen untuk membangun ekonomi daerah yang 
                mandiri dan berkelanjutan.
              </p>

              <div className="space-y-4">
                <h3 className="font-bold text-xl text-foreground mb-6 text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Tiga Fungsi Utama Komisi B
                </h3>
                
                <div className="space-y-8">
                  <div className="border-l-4 border-primary pl-6 py-4 bg-gradient-to-r from-primary/5 to-transparent rounded-r-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                    <h4 className="font-bold text-lg text-primary mb-3 flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                      Anggaran (Budgeting)
                    </h4>
                    <ul className="text-muted-foreground space-y-2 text-sm text-justify leading-relaxed">
                      <li className="flex items-start">
                        <span className="text-primary mr-2 mt-1">•</span>
                        <span>Membahas dan mengawasi target Pendapatan Asli Daerah (PAD), seperti pajak dan retribusi untuk memastikan sumber pendapatan daerah yang berkelanjutan.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2 mt-1">•</span>
                        <span>Membahas alokasi anggaran untuk dinas-dinas di bidang ekonomi agar setiap program dapat berjalan dengan optimal dan tepat sasaran.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2 mt-1">•</span>
                        <span>Memastikan keuangan daerah dikelola secara efisien dan transparan untuk meningkatkan kepercayaan masyarakat terhadap pemerintah daerah.</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-primary pl-6 py-4 bg-gradient-to-r from-primary/5 to-transparent rounded-r-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                    <h4 className="font-bold text-lg text-primary mb-3 flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                      Pengawasan (Oversight)
                    </h4>
                    <ul className="text-muted-foreground space-y-2 text-sm text-justify leading-relaxed">
                      <li className="flex items-start">
                        <span className="text-primary mr-2 mt-1">•</span>
                        <span>Mengawasi kinerja dinas-dinas dan BUMD (Badan Usaha Milik Daerah) agar berjalan baik dan memberi keuntungan bagi daerah serta masyarakat.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2 mt-1">•</span>
                        <span>Menampung aspirasi masyarakat terkait isu ekonomi, seperti masalah pedagang pasar, pertanian, atau UMKM untuk menjadi bahan pertimbangan kebijakan.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2 mt-1">•</span>
                        <span>Memastikan program ekonomi pemerintah kabupaten berjalan sesuai rencana dan memberikan dampak positif bagi pembangunan daerah.</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-primary pl-6 py-4 bg-gradient-to-r from-primary/5 to-transparent rounded-r-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                    <h4 className="font-bold text-lg text-primary mb-3 flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                      Legislasi (Peraturan)
                    </h4>
                    <ul className="text-muted-foreground space-y-2 text-sm text-justify leading-relaxed">
                      <li className="flex items-start">
                        <span className="text-primary mr-2 mt-1">•</span>
                        <span>Menyusun dan membahas Rancangan Peraturan Daerah (Perda) yang berkaitan dengan sektor ekonomi untuk mendukung pertumbuhan ekonomi daerah.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2 mt-1">•</span>
                        <span>Membuat kebijakan yang berkaitan dengan sektor ekonomi untuk menciptakan iklim usaha yang kondusif dan mendukung investasi daerah.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2 mt-1">•</span>
                        <span>Memastikan regulasi mendukung pertumbuhan ekonomi daerah dan memberikan perlindungan serta kemudahan bagi pelaku usaha lokal.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
