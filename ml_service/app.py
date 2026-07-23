from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.decomposition import TruncatedSVD
import os

app = Flask(__name__)

@app.route('/recommend', methods=['POST'])
def recommend():
    print("Recommendation request received")
    try:
        data = request.json
        ratings_raw = data.get('ratings', [])
        target_user = data.get('target_user', '')

        # ── Baseline Data Check ──────────────────────────────────────────────────
        if len(ratings_raw) < 5:
            return jsonify({'recommendations': [], 'reason': 'not enough data', 'fallback': True})

        df = pd.DataFrame(ratings_raw)  # columns: user_id, destination, rating

        # Target user existence check
        if target_user not in df['user_id'].values:
            return jsonify({'recommendations': [], 'reason': 'target user not found in data', 'fallback': True})

        # ── Create User-Item Interaction Matrix ─────────────────────────────────
        user_item_matrix = df.pivot_table(index='user_id', columns='destination', values='rating')
        
        # 🚨 FIX 1: Mean Normalization to protect ratings scaling from collapsing to 0
        user_means = user_item_matrix.mean(axis=1)
        # Fill missing values with the user's average rating instead of hardcoded 0
        normalized_matrix = user_item_matrix.sub(user_means, axis=0).fillna(0)

        all_destinations = normalized_matrix.columns.tolist()
        user_idx = normalized_matrix.index.get_loc(target_user)

        # ── Train TruncatedSVD Model ─────────────────────────────────────────────
        # SVD latent components calculation boundaries logic
        n_features = min(10, normalized_matrix.shape[0] - 1, normalized_matrix.shape[1] - 1)
        if n_features < 1:
            n_features = 1

        svd = TruncatedSVD(n_components=n_features, random_state=42)
        
        # Compress and Reconstruct matrix mapping
        compressed_matrix = svd.fit_transform(normalized_matrix)
        reconstructed_normalized = np.dot(compressed_matrix, svd.components_)
        
        # 🚨 FIX 2: Denormalize back to actual 1-5 scale range by adding back user mean
        target_user_mean = user_means.iloc[user_idx]
        if pd.isna(target_user_mean): 
            target_user_mean = 3.5 # Standard neutral fallback rating if user has extreme sparse inputs
            
        target_user_preds = reconstructed_normalized[user_idx] + target_user_mean
        
        # Clip values to stay strictly within our 1.0 to 5.0 database constraints
        target_user_preds = np.clip(target_user_preds, 1.0, 5.0)

        # Find what the user has NOT rated yet
        user_actual_ratings = user_item_matrix.iloc[user_idx]
        unrated_destinations = [
            (dest, float(round(target_user_preds[i], 1))) 
            for i, dest in enumerate(all_destinations) 
            if pd.isna(user_actual_ratings[dest]) or user_actual_ratings[dest] == 0
        ]

        if not unrated_destinations:
            return jsonify({'recommendations': [], 'reason': 'user has rated everything', 'fallback': True})

        # ── Sort and format data outputs ────────────────────────────────────────
        predictions = [{'destination': dest, 'score': score} for dest, score in unrated_destinations]
        predictions.sort(key=lambda x: x['score'], reverse=True)
        
        # 🚨 FIX 3: Soft dynamic matching threshold (Fallback safety net)
        top5 = [p for p in predictions if p['score'] >= 3.0][:5]
        
        # Safe fallback trigger if filtering parameters are too strict for early data
        if not top5:
            top5 = predictions[:5]

        # Add total counts context map signal for UI rendering
        dest_counts = df.groupby('destination')['rating'].count().to_dict()
        for p in top5:
            p['ratedByCount'] = int(dest_counts.get(p['destination'], 0))

        return jsonify({
            'recommendations': top5, 
            'reason': 'collaborative_filtering',
            'fallback': False
        })

    except Exception as e:
        print(f"Error inside Flask recommendation server pipeline: {str(e)}")
        return jsonify({'error': 'Internal server computation error', 'details': str(e)}), 500


if __name__ == '__main__':
    print("Flask Recommendation Service started on port 5001")
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)