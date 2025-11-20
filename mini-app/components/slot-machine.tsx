"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["apple", "banana", "cherry", "lemon"];

function getRandomFruit() {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export default function SlotMachine() {
  const [grid, setGrid] = useState<string[][]>(
    Array.from({ length: 3 }, () => Array.from({ length: 3 }, getRandomFruit))
  );
  const [isSpinning, setIsSpinning] = useState(false);
  const [win, setWin] = useState(false);

  useEffect(() => {
    if (!isSpinning) {
      const rows = grid;
      const cols = [
        [grid[0][0], grid[1][0], grid[2][0]],
        [grid[0][1], grid[1][1], grid[2][1]],
        [grid[0][2], grid[1][2], grid[2][2]],
      ];
      const hasWin =
        rows.some(r => r[0] === r[1] && r[1] === r[2]) ||
        cols.some(c => c[0] === c[1] && c[1] === c[2]);
      setWin(hasWin);
    }
  }, [grid, isSpinning]);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWin(false);
    const interval = setInterval(() => {
      setGrid(prev => {
        const newGrid = prev.map(row => [...row]);
        newGrid[2] = [...newGrid[1]];
        newGrid[1] = [...newGrid[0]];
        newGrid[0] = Array.from({ length: 3 }, getRandomFruit);
        return newGrid;
      });
    }, 200);
    setTimeout(() => {
      clearInterval(interval);
      setIsSpinning(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.flat().map((fruit, idx) => (
          <img
            key={idx}
            src={`/${fruit}.png`}
            alt={fruit}
            width={64}
            height={64}
          />
        ))}
      </div>
      <Button onClick={spin} disabled={isSpinning}>
        {isSpinning ? "Spinning..." : "Spin"}
      </Button>
      {win && !isSpinning && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-xl font-bold">You Win!</span>
          <Share text={`I just won with the Fruit Slot Machine! ${url}`} />
        </div>
      )}
    </div>
  );
}
