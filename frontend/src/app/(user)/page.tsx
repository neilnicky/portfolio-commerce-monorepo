/** Home — composition only. Hero / about / portfolio / contact sections. */
export default function HomePage() {
  return (
    <div className="flex flex-col gap-24">
      <section className="py-20">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
          Films, frames, and the tools behind them.
        </h1>
        <p className="mt-4 max-w-xl text-white/60">
          Filmmaker & content creator. Browse the work — and the digital assets that made it.
        </p>
      </section>
      <section id="about" className="py-10">
        <h2 className="text-2xl font-medium">About</h2>
      </section>
      <section id="portfolio" className="py-10">
        <h2 className="text-2xl font-medium">Work</h2>
      </section>
      <section id="contact" className="py-10">
        <h2 className="text-2xl font-medium">Let’s connect</h2>
      </section>
    </div>
  );
}
