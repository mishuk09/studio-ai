const profile = () => {
  return (
    <div className="min-h-screen bg-[var(--primary-color)] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-center rounded-2xl border border-white/10 bg-[var(--secondary-color)] p-8 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div>
          <h1 className="text-3xl font-bold text-white md:text-4xl">Profile</h1>
          <p className="mt-4 text-lg text-slate-300">Profile component updating.</p>
        </div>
      </div>
    </div>
  );
};

export default profile;
