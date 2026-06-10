export function ArticlesFilters() {
  const filters = [
    "Todos",
    "Comportamento alimentar",
    "Emagrecimento",
    "Nutrição esportiva",
    "Hábitos",
  ];

  return (
    <section className="bg-white px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-wrap gap-3">
        {filters.map((filter, index) => (
          <button
            key={filter}
            className={`rounded-full border px-5 py-3 text-sm font-medium transition ${
              index === 0
                ? "border-black bg-black text-white"
                : "border-neutral-200 bg-white hover:border-black"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </section>
  );
}