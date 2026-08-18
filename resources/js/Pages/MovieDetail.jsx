
import React from 'react';

export default function MovieDetail({ movie, onBack }) {
  if (!movie) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-12">
      {/* Tombol Kembali */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        ← Kembali ke Daftar
      </button>

      {/* Hero Section / Detail Card */}
      <div className="flex flex-col md:flex-row gap-8 bg-gray-800 rounded-xl p-6 md:p-8 shadow-2xl">
        {/* Poster Movie */}
        <div className="w-full md:w-1/3 flex-shrink-0">
          <img
            src={movie.posterUrl || 'https://via.placeholder.com/300x450'}
            alt={movie.title}
            className="w-full h-auto rounded-lg shadow-md object-cover aspect-[2/3]"
          />
        </div>

        {/* Informasi Movie */}
        <div className="flex flex-col justify-between w-full">
          <div>
            {/* Judul & Rating */}
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-3xl md:text-4xl font-bold">{movie.title}</h1>
              <span className="flex items-center gap-1 bg-yellow-500/10 text-yellow-400 font-semibold px-3 py-1 rounded-full text-sm">
                ⭐ {movie.rating || 'N/A'}
              </span>
            </div>

            {/* Meta Info (Tahun, Durasi, Genre) */}
            <div className="flex flex-wrap gap-2 text-sm text-gray-400 mt-3">
              <span>{movie.year}</span>
              <span>•</span>
              <span>{movie.duration}</span>
              <span>•</span>
              <div className="flex gap-1.5 flex-wrap">
                {movie.genres?.map((genre, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-700 text-gray-300 px-2.5 py-0.5 rounded-md text-xs"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Sinopsis */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-200">Sinopsis</h2>
              <p className="text-gray-300 text-sm md:text-base mt-2 leading-relaxed">
                {movie.synopsis || 'Belum ada sinopsis tersedia.'}
              </p>
            </div>

            {/* Sutradara & Cast */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-t border-gray-700 pt-4">
              <div>
                <span className="text-gray-400 block">Sutradara:</span>
                <span className="font-medium">{movie.director || '-'}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Pemeran Utama:</span>
                <span className="font-medium">
                  {movie.cast?.join(', ') || '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
              ▶ Tonton Trailer
            </button>
            <button className="border border-gray-600 hover:bg-gray-700 text-gray-200 px-4 py-2.5 rounded-lg transition-colors">
              + Simpan ke Watchlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}