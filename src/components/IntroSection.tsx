import { useConfig } from '../hooks/useConfig';

/**
 * Sayfa üstünde her zaman görünen giriş metni.
 * Kaybolmaz, aşağı kaydırınca yapboz gelir.
 */
export function IntroSection() {
  const { intro } = useConfig();

  return (
    <section className="mb-10">
      <h1 className="font-display text-3xl md:text-4xl font-light mb-5 text-ink">
        {intro.greeting}
      </h1>
      <div className="space-y-3 text-[14px] leading-relaxed text-ink/80">
        {intro.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </section>
  );
}
