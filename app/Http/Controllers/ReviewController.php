<?php

namespace App\Http/Controllers;

use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'movie_id' => 'required|integer',
            'rating'   => 'required|integer|min:1|max:5',
            'comment'  => 'required|string|min:3|max:1000',
        ]);

        Review::updateOrCreate(
            [
                'user_id'  => auth()->id(),
                'movie_id' => $validated['movie_id'],
            ],
            [
                'rating'  => $validated['rating'],
                'comment' => $validated['comment'],
            ]
        );

        return back()->with('success', 'Ulasan berhasil disimpan!');
    }

    public function destroy(Review $review)
    {
        if ($review->user_id !== auth()->id()) {
            abort(403);
        }

        $review->delete();

        return back()->with('success', 'Ulasan berhasil dihapus.');
    }
}