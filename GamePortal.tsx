import React, { useState, useMemo } from "react";
import { games } from "./games";

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function GamePortal() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // ✅ Modal state for info
  const [showInfo, setShowInfo] = useState(false);

  const categories = ["All", ...new Set(games.map((g) => g.category))];

  const filteredGames = useMemo(() => {
    const filtered = games.filter(
      (game) =>
        (category === "All" || game.category === category) &&
        game.title.toLowerCase().includes(search.toLowerCase())
    );
    return shuffleArray(filtered);
  }, [category, search]);

  return (
    <div className="min-h-screen flex bg-gray-900 text-white" id="k">
      {/* Sidebar */}
      <aside
        className="w-52 bg-gray-800 border-r border-gray-700 p-4 space-y-3 fixed left-0 top-0 bottom-0"
        id="w"
      >
        <h2 className="text-lg font-bold text-yellow-400 mb-4">Categories</h2>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`block w-full text-left px-3 py-2 rounded-md hover:bg-gray-700 ${
              category === c ? "bg-gray-700 text-yellow-400" : "text-gray-300"
            }`}
          >
            {c === "All" ? "Home" : c}
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-52">
        {/* Navbar */}
        <nav className="w-full min-w-full h-20 bg-gray-900 border-b border-gray-800 sticky top-0 z-50 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src="https://files.catbox.moe/mln0rn.png"
                alt="Parrot Logo"
                className="w-12 h-12"
              />
              <span className="text-white font-bold text-2xl font-[Montserrat]">
                ParrotGames
              </span>
            </div>

            {/* Search + Gold Glow Message */}
            <div className="flex items-center gap-4" id="torna">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pirt"
              />
              <p
                id="gold-glow"
                className="font-bold text-yellow-400 text-lg cursor-pointer"
                onClick={() => setShowInfo(true)}
              >
                Welcome to Parrot Games!
              </p>
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-6" id="popo">
          {selectedGame ? (
            <div className="flex flex-col items-center" id="sa">
              <button
                onClick={() => setSelectedGame(null)}
                className="mb-4 px-6 py-2 bg-red-600 rounded-lg shadow-lg hover:bg-red-700 transition"
                id="papa"
              >
                ⬅ Back to Lobby
              </button>
              <iframe
                src={selectedGame}
                title="Game"
                className="w-[60%] h-[76.5vh] rounded-xl shadow-2xl border-4 border-yellow-400"
              ></iframe>
            </div>
          ) : (
            <div className="flex flex-wrap gap-6 justify-start" id="iii">
              {filteredGames.length > 0 ? (
                filteredGames.map((game) => (
                  <div
                    key={game.title}
                    onClick={() => setSelectedGame(game.url)}
                    className="game-card"
                  >
                    {game.thumbnail ? (
                      <img src={game.thumbnail} alt={game.title} />
                    ) : (
                      <div className="no-thumbnail">Görsel Yok</div>
                    )}
                    <div className="game-title">{game.title}</div>
                  </div>
                ))
              ) : (
                <p className="text-center col-span-full text-gray-400">
                  😢 Game didn't find...
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Info Modal */}
{showInfo && (
  <div className="modal-overlay" onClick={() => setShowInfo(false)}>
    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
      <h2 className="text-xl font-bold text-yellow-400 mb-4">About ParrotGames</h2>
      <p>This site created for play mini-games u can play every game u want. Enjoy!</p>
      <p>© 2025 ParrotGames. All Rights Reserved ©</p>
      <button onClick={() => setShowInfo(false)}>Close</button>
    </div>
  </div>
)}
    </div>
  );
}
