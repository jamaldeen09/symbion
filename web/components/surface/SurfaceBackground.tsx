import Image from 'next/image';

export default function SurfaceBackground() {
  return (
    <div className="absolute inset-0 w-full h-[100vh] overflow-hidden flex items-center justify-center bg-[#EAEAEA] select-none pointer-events-none z-0">
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <Image
          src="https://framerusercontent.com/images/9CGS5vDnNEb9gNflSwYWSyamhQU.png?width=2000&height=1882"
          alt="Surface Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          unoptimized
        />
      </div>
    </div>
  );
}