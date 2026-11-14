import React, { useState, useEffect } from 'react';
import { useUser } from "../context/UserContext";

const FALLBACK_QUOTES = {
  special: [
    { quote_text: "Whatever you lose, you'll find it again.", author: "Kenshin Himura" },
    { quote_text: "A person grows up when he’s able to overcome hardships.", author: "Jiraiya" }
  ],
  normal: [
    { quote_text: "I'll leave tomorrow's problems to tomorrow's me.", author: "Saitama" },
    { quote_text: "If you don't like your destiny, don't accept it.", author: "Naruto Uzumaki" }
  ]
};

const getRandomQuote = (arr) => arr[Math.floor(Math.random() * arr.length)];

export default function GreetingHeader({ isLoggedIn, dbQuotes = [] }) {
  const { userProfile } = useUser();
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    const activeQuotes = dbQuotes.filter(q => q.is_active !== false);
    const targetType = isLoggedIn ? 'special' : 'normal';
    
    let pool = activeQuotes.filter(q => q.quote_type === targetType);
    if (pool.length === 0) pool = activeQuotes; 

    if (pool.length > 0) {
      setQuote(getRandomQuote(pool));
    } else {
      setQuote(getRandomQuote(FALLBACK_QUOTES[targetType]));
    }
  }, [isLoggedIn, dbQuotes]);

  if (!quote) return <header className="min-h-[80px]"></header>;

  return (
    <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-8 w-full">
      
      {/* LEFT: Greeting */}
      <h1 className="text-3xl md:text-4xl font-black tracking-tight shrink-0">
        {isLoggedIn ? (
          <span className="text-text-primary">
            Okaeri, <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-primary to-accent-secondary">
              {userProfile?.first_name || 'User'}
            </span>-sama
          </span>
        ) : (
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-text-secondary">
            Irasshaimase!
          </span>
        )}
      </h1>
      
      {/* RIGHT: Quote Section */}
      <div className="flex items-start gap-2 max-w-xl opacity-90 lg:justify-end">
        <span className="text-2xl text-accent-primary font-serif leading-none mt-0.5">"</span>
        <div className="flex flex-col gap-1">
          <p className="text-sm md:text-base text-text-secondary font-medium italic leading-snug">
            {quote.quote_text}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] md:text-xs font-bold text-accent-primary uppercase tracking-wider">
              — {quote.author}
            </span>
            {quote.anime && (
              <span className="text-[10px] text-text-muted font-semibold tracking-wide px-1.5 py-0.5 rounded-md bg-background-secondary border border-border">
                {quote.anime}
              </span>
            )}
          </div>
        </div>
      </div>

    </header>
  );
}