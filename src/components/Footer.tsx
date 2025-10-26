import React from "react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          {/* Brand */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-2xl">S</span>
              </div>
              <span className="font-bold text-2xl">Setiya Utama</span>
            </div>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto leading-relaxed">
              Mengabdi dari Hati, Blora Berdikari untuk masa depan yang lebih baik.
            </p>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center">
          <p className="text-primary-foreground/80 text-sm">
            © {currentYear} Setiya Utama. Semua hak dilindungi.
            <br />Backed by DaivanLabs
          </p>
        </div>
      </div>
    </footer>
  );
};
