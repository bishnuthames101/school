import TopNavbar from '@/components/TopNavbar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNavbar />
      <Header />
      <main className="flex-grow pt-32 sm:pt-36 lg:pt-32">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
