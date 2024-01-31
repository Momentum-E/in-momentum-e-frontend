import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
        <Navbar />
      {children}
    </section>
  );
}