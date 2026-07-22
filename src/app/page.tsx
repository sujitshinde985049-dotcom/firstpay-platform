import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center bg-slate-950 text-white">
      <Container className="py-24">
        <p className="mb-5 text-sm font-semibold tracking-[0.25em] text-emerald-400 uppercase">
          Payment infrastructure
        </p>
        <h1 className="max-w-4xl text-5xl leading-tight font-semibold tracking-tight sm:text-7xl">
          Build the future of payments with {siteConfig.name}.
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
          A production-ready foundation for secure, scalable payment
          experiences.
        </p>
      </Container>
    </main>
  );
}
