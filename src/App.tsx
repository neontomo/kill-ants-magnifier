import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [amountAnts, setAmountAnts] = useState(100);
  const [deadAnts, setDeadAnts] = useState(0);

  const random = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  useEffect(() => {
    function moveAnt(ant: HTMLElement) {
      if (!ant.classList.contains('mobile')) return;

      const x = ant.style.transform
        ? Number(ant.style.transform.split('(')[1].split('px')[0])
        : window.innerWidth / 2;
      const y = ant.style.transform
        ? Number(ant.style.transform.split(',')[1].split('px')[0])
        : window.innerHeight / 2;
      const walkLength = 100;

      const directionX = Math.floor(random(0, 2)) === 0 ? 1 : -1;
      const directionY = Math.floor(random(0, 2)) === 0 ? 1 : -1;

      const newX = x + directionX * walkLength + random(-100, 100);
      const newY = y + directionY * walkLength + random(-100, 100);

      const speed = random(1, 2);

      if (
        newX < 0 ||
        newX > window.innerWidth - 20 ||
        newY < 0 ||
        newY > window.innerHeight - 20
      ) {
        try {
          moveAnt(ant);
        } catch (error) {
          console.log(error);
        }
        return;
      }

      ant.style.transition = `transform ${speed}s linear`;
      ant.style.transform = `translate(${newX}px, ${newY}px)`;
      setTimeout(() => {
        moveAnt(ant);
      }, speed * 1000);
    }

    if (isLoading) {
      setIsLoading(false);
      const ants = document.querySelectorAll('.ant');
      ants.forEach((ant) => {
        const x = random(0, window.innerWidth);
        const y = random(0, window.innerHeight);
        (ant as HTMLElement).style.transform = `translate(${x}px, ${y}px)`;
        setTimeout(() => {
          moveAnt(ant as HTMLElement);
        }, 200);
      });

      document.addEventListener('mousemove', (e) => {
        const magnifierContainer = document.querySelector(
          '.magnifier-container'
        );
        const x = e.clientX;
        const y = e.clientY;

        magnifierContainer?.setAttribute(
          'style',
          `transform: translate(${x}px, ${y}px) translate(-50%, -50%)`
        );
      });

      setInterval(() => {
        ants.forEach((ant, index) => {
          const magnifierContainer = document.querySelector(
            '.magnifier-container'
          );
          const x = magnifierContainer?.getBoundingClientRect().left;
          const y = magnifierContainer?.getBoundingClientRect().top;

          const magnifierX =
            magnifierContainer?.getBoundingClientRect().left || 0;
          const magnifierY =
            magnifierContainer?.getBoundingClientRect().top || 0;
          const magnifierWidth =
            magnifierContainer?.getBoundingClientRect().width || 0;
          const magnifierHeight =
            magnifierContainer?.getBoundingClientRect().height || 0;

          // if ant collides with magnifier
          if (
            ant.getBoundingClientRect().left > magnifierX + 30 &&
            ant.getBoundingClientRect().left <
              magnifierX + magnifierWidth - 30 &&
            ant.getBoundingClientRect().top > magnifierY + 30 &&
            ant.getBoundingClientRect().top < magnifierY + magnifierHeight - 30
          ) {
            ant.classList.remove('mobile');

            (ant as HTMLElement).classList.add('burn');
            setTimeout(() => {
              ant.remove();
              setDeadAnts(
                amountAnts - Number(document.querySelectorAll('.ant').length)
              );
            }, 1300);
          }
        });
      }, 50);
    }
  }, [isLoading]);

  return (
    <div className="App">
      <div className="overlay grain w-full h-full block fixed opacity-40"></div>
      <div className="magnifier-container absolute p-0 flex flex-col">
        <div className="magnifier bg-[#ffe8ae] w-48 h-48 rounded-[100%] border-4 border-black flex justify-center"></div>
      </div>
      <main>
        <div className="counter p-4">
          <span className="text-white">{`${deadAnts}/${amountAnts} ants dead`}</span>
        </div>
        <div>
          {deadAnts === amountAnts && (
            <span className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <h1 className="text-5xl leading-loose">Damn.</h1>
              <div className="text-xl leading-loose">
                You killed all the ants.
              </div>
              <div className="text-xl leading-loose">Slightly unnecessary.</div>
            </span>
          )}
        </div>
        {Array.from({ length: amountAnts }).map((ant, i) => (
          <div
            key={i}
            className="ant mobile w-1 h-1 absolute bg-black rounded-[100%]"
          ></div>
        ))}
      </main>
    </div>
  );
}

export default App;
