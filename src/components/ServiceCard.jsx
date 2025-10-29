export default function ServiceCard({ image, title, description, highlights = [], accent = '#f59e0b' }) {
  return (
    <article className="group relative overflow-hidden rounded-[24px] shadow-xl bg-gray-900 text-white transition-transform duration-500 hover:-translate-y-1">
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/65 to-black/35" />

      <div className="relative z-10 flex h-full flex-col gap-4 p-8">
        <div className="inline-flex w-fit items-center gap-2 rounded-full px-4 py-1 text-sm font-semibold tracking-[0.18em] uppercase"
          style={{ backgroundColor: `${accent}1a`, color: accent }}
        >
          {title}
        </div>
        <p className="text-base text-white/85 leading-relaxed">{description}</p>
        {highlights?.length > 0 && (
          <ul className="mt-auto grid gap-2 text-sm text-white/80">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

