'use client'

import {TypeAnimation} from 'react-type-animation'

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="">
          <TypeAnimation
          sequence={[
            // Same substring at the start will only be typed out once, initially
            'Meet a student.',
            1000, // wait 1s before replacing "Mice" with "Hamsters"
            'Meet an aspiring MedxTech Innovator.',
            1000,
            'Meet a polyglot.',
            1000,
            'Hi, my name is Kuan.',
            1000
          ]}
          wrapper="span"
          speed={25}
          deletionSpeed={25}
          style={{ fontSize: '5em', display: 'inline-block', fontFamily: 'Roboto', color: 'var(--text-dark)' 
          }}
          cursor={true}
          repeat={0}
        />
      </header>
      
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}
