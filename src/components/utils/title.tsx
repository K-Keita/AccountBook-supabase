export const Title = () => {
  return (
    <div className="flex relative justify-around border-b">
      <h2 className="absolute top-20 z-40 text-3xl font-semibold tracking-lg text-center animate-slit-in-vertical">
        Title
      </h2>
      <div className="mt-auto w-8 h-24 bg-blue-400 animate-scale-in-ver-bottom"></div>
      <div className="mt-auto w-8 h-12 bg-blue-400 animate-scale-in-ver-bottom"></div>
      <div className="mt-auto w-8 h-20 bg-blue-400 animate-scale-in-ver-bottom"></div>
      <div className="mt-auto w-8 h-32 bg-blue-400 animate-scale-in-ver-bottom"></div>
      <div className="mt-auto w-8 h-16 bg-blue-400 animate-scale-in-ver-bottom"></div>
    </div>
  );
}
