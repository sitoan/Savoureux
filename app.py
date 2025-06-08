from flask import Flask, request, jsonify
from script.controller.recipe_controller import recipe_controller
from script.controller.user_controller import user_controller
from datetime import datetime

app = Flask(__name__)

recipe_ctrl = recipe_controller()
user_ctrl = user_controller()

@app.route("/recipe/create", methods=["POST"])
def add_recipe():
    data = request.json
    recipe_id = recipe_ctrl.add_recipe(data)
    return jsonify({"recipe_id": recipe_id}), 201

@app.route("/recipe/<recipe_id>", methods=["GET"])
def get_recipe(recipe_id):
    recipe = recipe_ctrl.get_recipe_by_id(recipe_id)
    return jsonify(recipe) if recipe else ("Not found", 404)

@app.route("/recipe/all", methods=["GET"])
def get_all_recipes():
    return jsonify(recipe_ctrl.get_all_recipes())

@app.route("/recipe/<recipe_id>", methods=["PUT"])
def update_recipe(recipe_id):
    updates = request.json
    success = recipe_ctrl.update_recipe(recipe_id, updates)
    return ("Updated", 200) if success else ("Not found", 404)

@app.route("/recipe/<recipe_id>", methods=["DELETE"])
def delete_recipe(recipe_id):
    success = recipe_ctrl.delete_recipe(recipe_id)
    return ("Deleted", 200) if success else ("Not found", 404)

@app.route("/recipe/<recipe_id>/rate", methods=["POST"])
def rate_recipe(recipe_id):
    rating = request.json.get("rating", 0)
    success = recipe_ctrl.update_rating(recipe_id, rating)
    return ("Rated", 200) if success else ("Not found", 404)

@app.route("/recipe/<recipe_id>/comment", methods=["POST"])
def add_comment(recipe_id):
    comment = request.json
    success = recipe_ctrl.add_comment(recipe_id, comment)
    return ("Commented", 200) if success else ("Not found", 404)

# --- USER APIs ---

@app.route("/user/create", methods=["POST"])
def add_user():
    data = request.json
    user_id = user_ctrl.add_user(data)
    return jsonify({"user_id": user_id}), 201

@app.route("/user/<user_id>", methods=["GET"])
def get_user(user_id):
    user = user_ctrl.get_user_by_id(user_id)
    return jsonify(user) if user else ("Not found", 404)

# @app.route("/user/<user_id>/view/<recipe_id>", methods=["POST"])
# def user_view_recipe(user_id, recipe_id):
#     now = datetime.utcnow().isoformat() + "Z"
#     duration = request.json.get("duration", 0)

#     user = user_ctrl.get_user_by_id(user_id)
#     if not user:
#         return ("User not found", 404)

#     history = user.setdefault("view_history", {})
#     if recipe_id not in history:
#         history[recipe_id] = {
#             "view_count": 0,
#             "total_duration": 0,
#             "last_viewed_at": None,
#             "just_viewed": {
#                 "start": None,
#                 "end": None,
#                 "duration": 0
#             }
#         }

#     entry = history[recipe_id]
#     entry["view_count"] += 1
#     entry["total_duration"] += duration
#     entry["last_viewed_at"] = now
#     entry["just_viewed"] = {
#         "start": now,
#         "end": now,  # có thể cho người dùng gửi timestamp bắt đầu/kết thúc thật nếu muốn
#         "duration": duration
#     }

#     user_ctrl.update_user(user_id, user)
#     return ("View recorded", 200)

if __name__ == "__main__":
    app.run(debug=True)
