import React, { useState, useEffect } from 'react';
import { useUser } from "../context/UserContext";

// Keep your original quotes as an indestructible fallback!
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

export default function GreetingHeader({ isLoggedIn }) {
  const { userProfile } = useUser();
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        // Hitting your public API (make sure this route exists!)
        const res = await fetch('http://localhost:5000/api/quotes');
        const json = await res.json();

        if (json.success && json.data.length > 0) {
          // 1. Only use quotes marked as active
          const activeQuotes = json.data.filter(q => q.is_active);

          // 2. Split them up
          const specialQuotes = activeQuotes.filter(q => q.quote_type === 'special');
          const normalQuotes = activeQuotes.filter(q => q.quote_type === 'normal');

          // 3. Pick the right pool, with a fallback if a specific pool is empty
          let quotePool = isLoggedIn ? specialQuotes : normalQuotes;
          if (quotePool.length === 0) quotePool = activeQuotes; 

          if (quotePool.length > 0) {
            const randomQuote = quotePool[Math.floor(Math.random() * quotePool.length)];
            setQuote(randomQuote);
            return; // Success! Exit early.
          }
        }
      } catch (err) {
        console.error("Failed to fetch quotes, using fallbacks:", err);
      }

      // 4. Fallback logic if the fetch failed or DB is empty
      const fallbackPool = isLoggedIn ? fallbackQuotes.special : fallbackQuotes.normal;
      setQuote(fallbackPool[Math.floor(Math.random() * fallbackPool.length)]);
    };

    fetchQuotes();
  }, [isLoggedIn]);

  const greeting = isLoggedIn ? `Okaeri, ${userProfile?.first_name || 'User'} - sama` : "Irasshaimase!";

  // Don't render the text until we have a quote ready to prevent flashing
  if (!quote) return <header className="px-2 h-10 flex justify-between"></header>;

  return (
    <header className="px-2 flex justify-between">
      <h1 className="text-3xl font-bold font-playwrite text-text-primary tracking-tight">{greeting}</h1>
      <div className="hidden lg:flex items-center gap-2 text-text-muted italic pl-4 py-1">
        <span className="text-lg">"</span>
        <p className="text-sm">
          {quote.quote_text}
          <span className="text-lg">"</span> 
          <span className="not-italic font-bold text-xs text-accent-hover ml-2">
            — {quote.author} 
            {/* If the anime exists in the DB, show it in parentheses! */}
            {quote.anime && <span className="text-white/40 font-normal ml-1">({quote.anime})</span>}
          </span>
        </p>
      </div>
    </header>
  );
}