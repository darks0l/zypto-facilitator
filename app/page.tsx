import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ChainCard from "@/components/ChainCard";
import HowItWorks from "@/components/HowItWorks";
import CodeExample from "@/components/CodeExample";
import ApiReference from "@/components/ApiReference";
import ToolsSection from "@/components/ToolsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <Hero />

      {/* Chain Cards Section */}
      <section className="py-20 px-6">
        <div className="max-w-content mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Supported Chains
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Three chains. One API. USDC payments with zero gas fees.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ChainCard chainKey="base" />
            <ChainCard chainKey="bnb" />
            <ChainCard chainKey="ethereum" />
          </div>
        </div>
      </section>

      <HowItWorks />
      <CodeExample />
      <ApiReference />
      <ToolsSection />
      <Footer />
    </main>
  );
}
