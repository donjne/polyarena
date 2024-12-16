import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-purple-600/20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-['Russo_One'] bg-gradient-to-r from-purple-600 to-blue-600 
                         text-transparent bg-clip-text mb-6">
              Gamified Prediction Markets
            </h1>
            <p className="text-xl text-purple-900 mb-8">
              Compete in prediction arenas with NFT avatars and win rewards
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link
                href="/marketplace"
                className="px-8 py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700"
              >
                Browse Marketplace
              </Link>
              <Link
                href="/arenas"
                className="px-8 py-3 rounded-lg border-2 border-purple-600 text-purple-600 
                         font-medium hover:bg-purple-50"
              >
                Join Arena
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}