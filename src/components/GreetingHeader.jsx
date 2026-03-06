import React, { useState, useEffect } from 'react';
import { useUser } from "../context/UserContext";

// Keep your indestructible fallback quotes!
const fallbackQuotes = {
  special: [
    { quote_text: "Whatever you lose, you'll find it again.", author: "Kenshin Himura" },
    { quote_text: "A person grows up when he’s able to overcome hardships.", author: "Jiraiya" }
  ],
  normal: [
    { quote_text: "I'll leave tomorrow's problems to tomorrow's me.", author: "Saitama" },
    { quote_text: "If you don't like your destiny, don't accept it.", author: "Naruto Uzumaki" }
  ]
};

// Accept dbQuotes as a prop from HomePage
export default function GreetingHeader({ isLoggedIn, dbQuotes }) {
  const { userProfile } = useUser();
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    // 1. Process DB quotes if we received them
    let activeQuotes = [];
    if (dbQuotes && dbQuotes.length > 0) {
      activeQuotes = dbQuotes.filter(q => q.is_active !== false); 
    }

    const specialQuotes = activeQuotes.filter(q => q.quote_type === 'special');
    const normalQuotes = activeQuotes.filter(q => q.quote_type === 'normal');

    // 2. Determine which pool to pull from based on auth status
    let dbPool = isLoggedIn ? specialQuotes : normalQuotes;
    if (dbPool.length === 0) dbPool = activeQuotes; 

    // 3. Assign the random quote
    if (dbPool.length > 0) {
      setQuote(dbPool[Math.floor(Math.random() * dbPool.length)]);
    } else {
      const fallbackPool = isLoggedIn ? fallbackQuotes.special : fallbackQuotes.normal;
      setQuote(fallbackPool[Math.floor(Math.random() * fallbackPool.length)]);
    }
  }, [isLoggedIn, dbQuotes]);

  const greeting = isLoggedIn ? `Okaeri, ${userProfile?.first_name || 'User'} - sama` : "Irasshaimase!";

  // Lock the height to prevent layout shifts while the effect runs
  if (!quote) return <header className="px-2 min-h-[40px] flex justify-between"></header>;

  return (
    <header className="px-2 flex justify-between items-center min-h-[40px] animate-fade-in">
      <h1 className="text-3xl font-bold font-playwrite text-text-primary tracking-tight">
        {greeting}
      </h1>
      
      <div className="hidden lg:flex items-center gap-2 text-text-muted italic pl-4 py-1">
        <span className="text-lg">"</span>
        <p className="text-sm">
          {quote.quote_text}
          <span className="text-lg">"</span> 
          <span className="not-italic font-bold text-xs text-accent-hover ml-2">
            — {quote.author} 
            {/* Swapped text-white/40 for your text-text-muted variable */}
            {quote.anime && <span className="text-text-muted font-normal ml-1">({quote.anime})</span>}
          </span>
        </p>
      </div>
    </header>
  );
}