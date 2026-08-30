<?php

namespace App\Http\Controllers;

use App\Models\Watchlist;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WatchlistController extends Controller
{
    // Menampilkan daftar Watchlist milik user yang sedang login
    public function index(Request $request)
    {
        $watchlists = Watchlist::where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return Inertia::render('Watchlist/Index', [
            'watchlists' => $watchlists
        ]);
    }

    // Menambah atau Menghapus film dari Watchlist (Toggle)
    public function toggle(Request $request)
    {
        $request->validate([
            'movie_id' => 'required',
            'title' => 'required|string',
            'poster_path' => 'nullable|string',
            'vote_average' => 'nullable',
            'release_date' => 'nullable',
        ]);

        $userId = $request->user()->id;
        $movieId = $request->movie_id;

        $existing = Watchlist::where('user_id', $userId)
            ->where('movie_id', $movieId)
            ->first();

        if ($existing) {
            $existing->delete();
            return back()->with('message', 'Dihapus dari Watchlist');
        } else {
            Watchlist::create([
                'user_id' => $userId,
                'movie_id' => $movieId,
                'title' => $request->title,
                'poster_path' => $request->poster_path,
                'vote_average' => $request->vote_average,
                'release_date' => $request->release_date,
            ]);
            return back()->with('message', 'Ditambahkan ke Watchlist');
        }
    }

    // Hapus spesifik dari halaman Watchlist
    public function destroy(Request $request, $id)
    {
        Watchlist::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->delete();

        return back();
    }
}