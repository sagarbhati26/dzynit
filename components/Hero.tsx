import Link from "next/link";

export default function Hero() {
  return (
    <section className="grid md:grid-cols-2 gap-12 items-center py-24 relative">
      {/* Background decorative elements */}
      <div className="absolute -z-10 top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-primary/10 to-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute -z-10 bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-secondary/10 to-primary/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="inline-block px-3 py-1 mb-6 text-xs font-medium text-primary bg-primary/10 rounded-full">
          Create & Sell Custom Apparel
        </div>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          <span className="text-gradient">Design.</span> Publish. <span className="text-gradient">Sell.</span>
        </h1>
        <p className="mt-6 text-lg text-muted max-w-xl leading-relaxed">
          DzynIt is a minimalist studio for creators — design premium tees &
          hoodies, save drafts, and publish to the marketplace with just a few clicks.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/dzyn">
            <button className="btn-primary px-6 py-3.5 rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2">
              <span>Start Designing</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
          </Link>
          <Link href="/marketplace">
            <button className="btn-secondary px-6 py-3.5 rounded-xl">
              Explore Marketplace
            </button>
          </Link>
        </div>
        
        <div className="mt-12 flex items-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`w-8 h-8 rounded-full border-2 border-background bg-primary-dark/80`} />
            ))}
          </div>
          <p className="text-sm text-muted">
            <span className="font-semibold text-foreground">1,200+</span> creators already using DzynIt
          </p>
        </div>
      </div>

      <div className="relative z-10">
        <div className="rounded-2xl card-glass p-8 soft-shadow relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-secondary/10 rounded-full blur-xl"></div>
          
          <div className="relative h-96 flex items-center justify-center">
            <div className="w-64 h-72 bg-white rounded-xl soft-shadow flex flex-col items-center justify-center relative">
              {/* T-shirt design mockup with subtle details */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 rounded-xl"></div>
              <div className="w-40 h-40 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full absolute top-6"></div>
              <div className="text-primary font-medium z-10">T-SHIRT PREVIEW</div>
              <div className="text-xs text-muted mt-2 z-10">Your design here</div>
              
              {/* Controls mockup */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-secondary"></div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-accent"></div>
                </div>
              </div>
            </div>
            
            {/* Floating elements for visual interest */}
            <div className="absolute top-6 right-6 w-12 h-12 rounded-lg bg-white shadow-sm flex items-center justify-center rotate-12">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path>
                <path d="M10 2c1 .5 2 2 2 5"></path>
              </svg>
            </div>
            <div className="absolute bottom-10 left-4 w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center -rotate-12">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.29 7 12 12 20.71 7"></polyline>
                <line x1="12" y1="22" x2="12" y2="12"></line>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}