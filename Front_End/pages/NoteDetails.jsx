// Placeholder page for displaying a single note's full details.
function NoteDetails() {
  return (
    <main className="min-h-screen pb-36 pt-10">
      <div className="mx-auto max-w-5xl px-4">
        <section className="relative overflow-hidden rounded-3xl border border-base-content/10 bg-base-100/75 p-8 shadow-2xl backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-primary/10" />
          <div className="relative z-10">
            <span className="badge badge-secondary badge-outline rounded-xl px-3 py-3">
              Details
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-base-content md:text-4xl">
              Note Details
            </h1>
            <p className="mt-3 max-w-2xl text-base-content/70">
              View complete information about a selected note including metadata
              and full content.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default NoteDetails;
