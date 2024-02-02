import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full h-auto">
      {/* <Navbar /> */}
      {children}
    </section>
  );
}
