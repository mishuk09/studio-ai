# Updated Backend Endpoints for Profile and Cover Photo Upload
# Replace your old endpoints with these updated versions

@app.route("/api/user/upload-profile-photo", methods=["POST"])
@token_required
def upload_profile_photo(current_user_email):
    """
    Upload profile photo to Cloudinary and store URL in database
    Expects JSON: { "profilePhotoUrl": "https://cloudinary.url..." }
    """
    data = request.get_json()
    
    if not data or "profilePhotoUrl" not in data:
        return jsonify({"error": "No photo URL provided"}), 400
    
    profile_photo_url = data["profilePhotoUrl"]
    
    # 🔎 Update user record in database
    users_doc = users_collection.find_one({"_id": "users"})
    if not users_doc:
        return jsonify({"error": "Users not found"}), 404
    
    user_found = False
    for batch in users_doc["batches"]:
        for user in batch["users"]:
            if user["email"] == current_user_email:
                # ✅ SAVE NEW PROFILE PHOTO URL (Cloudinary)
                user["profilePhoto"] = {
                    "url": profile_photo_url,
                    "path": profile_photo_url  # Store Cloudinary URL directly
                }
                user_found = True
                break
        if user_found:
            break
    
    if not user_found:
        return jsonify({"error": "User not found"}), 404
    
    users_collection.replace_one({"_id": "users"}, users_doc)
    
    return jsonify({
        "message": "Profile photo uploaded successfully",
        "profilePhotoUrl": profile_photo_url
    }), 200


@app.route("/api/user/upload-cover-photo", methods=["POST"])
@token_required
def upload_cover_photo(current_user_email):
    """
    Upload cover photo to Cloudinary and store URL in database
    Expects JSON: { "coverPhotoUrl": "https://cloudinary.url..." }
    """
    data = request.get_json()
    
    if not data or "coverPhotoUrl" not in data:
        return jsonify({"error": "No photo URL provided"}), 400
    
    cover_photo_url = data["coverPhotoUrl"]
    
    # 🔎 Update user record in database
    users_doc = users_collection.find_one({"_id": "users"})
    if not users_doc:
        return jsonify({"error": "Users not found"}), 404
    
    user_found = False
    for batch in users_doc["batches"]:
        for user in batch["users"]:
            if user["email"] == current_user_email:
                # ✅ SAVE NEW COVER PHOTO URL (Cloudinary)
                user["coverPhoto"] = {
                    "url": cover_photo_url,
                    "path": cover_photo_url  # Store Cloudinary URL directly
                }
                user_found = True
                break
        if user_found:
            break
    
    if not user_found:
        return jsonify({"error": "User not found"}), 404
    
    users_collection.replace_one({"_id": "users"}, users_doc)
    
    return jsonify({
        "message": "Cover photo uploaded successfully",
        "coverPhotoUrl": cover_photo_url
    }), 200
