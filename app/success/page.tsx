"use client";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";

export default function SuccessPage() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const update = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-[50dvh]">
      <Confetti width={size.width} height={size.height} />
      <h1 className="text-7xl font-bold">Thank you for upgrading!</h1>
      <span className="text-xl text-gray-300 mt-5">
        You may see your new features in a few minutes.
      </span>
    </div>
  );
}
