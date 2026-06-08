interface HeaderProps {
  title: string;
  subtitle: string;
}

export const DashboardHeader = ({ title, subtitle }: HeaderProps) => (
  <header className="mb-12">
    <h2 className="text-purple-400 text-sm font-semibold uppercase tracking-[0.2em] mb-2">
      {subtitle}
    </h2>
    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
      {title.split(',')[0]},
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
        {title.split(',')[1]}
      </span>
    </h1>
  </header>
);