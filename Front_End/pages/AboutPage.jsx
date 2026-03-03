function AboutPage() {
  return (
    <main className="min-h-screen pb-36 pt-10">
      <div className="mx-auto max-w-6xl px-4">
        <section className="relative overflow-hidden rounded-3xl border border-base-content/10 bg-base-100/75 p-8 shadow-2xl backdrop-blur-xl md:p-10">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />

          <div className="relative z-10 grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <img
                src="/noteverse-logo.svg"
                alt="NoteVerse logo"
                className="mb-4 h-14 w-auto"
                loading="lazy"
              />
              <span className="badge badge-primary badge-outline">
                Developer
              </span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-base-content md:text-4xl">
                About NoteVerse
              </h1>
              <p className="mt-3 max-w-3xl leading-relaxed text-base-content/70">
                NoteVerse is a smart and modern note-keeping platform built to
                help users capture ideas, organize tasks, and manage notes with
                a clean, focused workflow. It supports rich note content,
                cloud-based media attachments, secure authentication, and a
                responsive experience across devices.
              </p>
            </div>

            <div className="rounded-2xl border border-base-content/10 bg-base-100/70 p-5 shadow-md">
              <svg
                viewBox="0 0 240 180"
                className="h-40 w-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Animated book illustration"
              >
                <rect
                  x="32"
                  y="36"
                  width="84"
                  height="110"
                  rx="10"
                  className="fill-primary/20 stroke-primary"
                  strokeWidth="2"
                />
                <rect
                  x="124"
                  y="36"
                  width="84"
                  height="110"
                  rx="10"
                  className="fill-secondary/20 stroke-secondary"
                  strokeWidth="2"
                />
                <line
                  x1="120"
                  y1="36"
                  x2="120"
                  y2="146"
                  className="stroke-base-content/40"
                  strokeWidth="2"
                />

                <path
                  d="M46 56H102"
                  className="stroke-primary/60"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M46 72H102"
                  className="stroke-primary/40"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M46 88H96"
                  className="stroke-primary/30"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                <path
                  d="M136 56H192"
                  className="stroke-secondary/60"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M136 72H192"
                  className="stroke-secondary/40"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M136 88H186"
                  className="stroke-secondary/30"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                <g>
                  <circle cx="70" cy="22" r="4" className="fill-primary/70" />
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="0 0; 0 -4; 0 0"
                    dur="2.4s"
                    repeatCount="indefinite"
                  />
                </g>

                <g>
                  <circle
                    cx="170"
                    cy="18"
                    r="3"
                    className="fill-secondary/70"
                  />
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="0 0; 0 -6; 0 0"
                    dur="2.8s"
                    repeatCount="indefinite"
                  />
                </g>

                <path
                  d="M120 36C108 28 95 28 82 36"
                  className="stroke-base-content/50"
                  strokeWidth="2"
                  fill="none"
                >
                  <animate
                    attributeName="d"
                    dur="3s"
                    repeatCount="indefinite"
                    values="M120 36C108 28 95 28 82 36;M120 36C108 24 95 24 82 36;M120 36C108 28 95 28 82 36"
                  />
                </path>
              </svg>
            </div>
          </div>

          <div className="relative z-10 mt-8 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-base-content/10 bg-base-100/70 p-5 shadow-md">
              <h2 className="text-lg font-semibold text-base-content">
                Purpose
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-base-content/70">
                The goal of NoteVerse is to provide a simple but powerful space
                for personal productivity where notes are easy to write,
                organize, and revisit.
              </p>
            </article>

            <article className="rounded-2xl border border-base-content/10 bg-base-100/70 p-5 shadow-md">
              <h2 className="text-lg font-semibold text-base-content">
                App Highlights
              </h2>
              <ul className="mt-2 space-y-2 text-sm leading-relaxed text-base-content/70">
                <li>• Create, edit, pin, and delete notes</li>
                <li>• Image and video attachments with cloud storage</li>
                <li>• Fast search and clean dashboard experience</li>
                <li>• Secure account and profile management</li>
              </ul>
            </article>

            <article className="rounded-2xl border border-base-content/10 bg-base-100/70 p-5 shadow-md md:col-span-2">
              <h2 className="text-lg font-semibold text-base-content">
                Developer
              </h2>
              <p className="mt-2 text-sm text-base-content/70">
                This project was developed by Tochukwu Sunday.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href="mailto:Tochukwusun24@gmail.com"
                  className="btn btn-sm btn-outline rounded-xl"
                >
                  Tochukwusun24@gmail.com
                </a>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AboutPage;
