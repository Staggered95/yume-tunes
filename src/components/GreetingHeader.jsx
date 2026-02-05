const quotes = {
  special: [
    { text: "Whatever you lose, you'll find it again.", author: "Kenshin Himura" },
    { text: "A person grows up when he’s able to overcome hardships.", author: "Jiraiya" }
  ],
  normal: [
    { text: "I'll leave tomorrow's problems to tomorrow's me.", author: "Saitama" },
    { text: "If you don't like your destiny, don't accept it.", author: "Naruto Uzumaki" }
  ]
};

export default function GreetingHeader({ isLoggedIn }) {
  const greeting = isLoggedIn ? "Okaeri, Shubham-san!" : "Irasshaimase!";
  const quoteSet = isLoggedIn ? quotes.special : quotes.normal;
  const quote = quoteSet[Math.floor(Math.random() * quoteSet.length)];

  return (
    <header className="px-2 flex justify-between">
      <h1 className="text-3xl font-bold font-playwrite text-text-primary tracking-tight">{greeting}</h1>
      <div className="hidden lg:flex items-center gap-2 text-text-muted italic pl-4 py-1">
        <span className="text-lg">"</span>
        <p className="text-sm">
          {quote.text}<span className="text-lg">"</span> <span className="not-italic font-bold text-xs text-accent-hover ml-2">— {quote.author}</span>
        </p>
      </div>
    </header>
  );
}