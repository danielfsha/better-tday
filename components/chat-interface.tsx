"use client";

import FormComponent from "./form-component";

export default function ChatInterface() {
  return (
    <main className="flex items-center justify-center">
      <section className="flex w-full max-w-2xl flex-col items-center gap-6">
        <h1 className="text-center font-serif text-2xl text-white/80">
          What would you like to design tday?
        </h1>

        <p className="max-w-md text-center font-sans text-white/40 text-sm">
          Pick a format and start designing your idea. Tday understands your
          creativity and helps bring it to life.
        </p>

        <FormComponent />
      </section>
    </main>
  );
}
