export default function HeroSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-3xl mx-auto text-center space-y-8 mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
        Track Your Job Applications
        <span className="text-orange-600"> Effortlessly</span>
      </h2>
      <p className="text-xl text-gray-600">
        Keep all your job applications organized in one place and never miss an important deadline.
      </p>
      {children}
    </div>
  );
}