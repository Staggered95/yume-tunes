import React, { useState, useEffect } from 'react';
import { useUser } from "../context/UserContext";

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

export default function GreetingHeader({ isLoggedIn, dbQuotes }) {
  const { userProfile } = useUser();
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    let activeQuotes = [];
    if (dbQuotes && dbQuotes.length > 0) {
      activeQuotes = dbQuotes.filter(q => q.is_active !== false); 
    }
    const specialQuotes = activeQuotes.filter(q => q.quote_type === 'special');
    const normalQuotes = activeQuotes.filter(q => q.quote_type === 'normal');

    let dbPool = isLoggedIn ? specialQuotes : normalQuotes;
    if (dbPool.length === 0) dbPool = activeQuotes; 

    if (dbPool.length > 0) {
      setQuote(dbPool[Math.floor(Math.random() * dbPool.length)]);
    } else {
      const fallbackPool = isLoggedIn ? fallbackQuotes.special : fallbackQuotes.normal;
      setQuote(fallbackPool[Math.floor(Math.random() * fallbackPool.length)]);
    }
  }, [isLoggedIn, dbQuotes]);

  const greeting = isLoggedIn ? `Okaeri, ${userProfile?.first_name || 'User'}-sama` : "Irasshaimase!";

  if (!quote) return <header className="px-4 py-6 min-h-[100px]"></header>;

  return (
    <header className="px-4 py-2 md:py-4 flex flex-col md:flex-row md:justify-between md:items-end gap-2 md:gap-6 animate-fade-in border-l-4 border-accent-primary pl-6">
      <div className="flex flex-col">
        {/* Responsive font size: 2xl on mobile, 4xl on desktop */}
        <h1 className="text-2xl md:text-4xl font-black font-playwrite text-text-primary tracking-tighter italic">
          {greeting}
        </h1>
        
        {/* Quote: Visible on mobile, but styled as a subtle sub-text */}
        <div className="flex flex-wrap items-center gap-1 text-text-secondary italic mt-1 md:mt-2">
           <p className="text-xs md:text-sm line-clamp-2 md:line-clamp-none leading-relaxed">
            "{quote.quote_text}" 
            <span className="not-italic font-bold text-[10px] md:text-xs text-accent-primary ml-2 uppercase tracking-widest">
              — {quote.author} 
              {quote.anime && <span className="text-text-muted font-normal ml-1 lowercase">({quote.anime})</span>}
            </span>
          </p>
        </div>
      </div>

      {/* Optional: Add a subtle date/time or status for desktop purely for 'aesthetic' balance */}
      <div className="hidden lg:block text-[10px] font-black uppercase tracking-[0.4em] text-text-muted/30 pb-1">
        {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
      </div>
    </header>
  );
}