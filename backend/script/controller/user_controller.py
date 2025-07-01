
from flask import Blueprint, jsonify, request
from flask_cors import CORS
from script.service.recipe_service import recipe_service
from script.service.user_service import user_service

user_bp = Blueprint("user", __name__)
CORS(user_bp)
user_ser = user_service()
recipe_ser = recipe_service()

### get user favorite recipes
@user_bp.route("/favorite/<user_id>", methods=["GET"])
def get_user_favorite(user_id):
    user_favorites = user_ser.get_user_favorite_recipes(user_id)
    recipe_favorites = recipe_ser.get_favorite_recipes(user_favorites)
    return jsonify(recipe_favorites)


### signup
@user_bp.route("/signup", methods=["POST"])
def add_user():
    data = request.json
    user_id = user_ser.add_user(data)
    return jsonify({"user_id": user_id}), 201

### signin 
@user_bp.route("/signin", methods=["POST"])
def signin():
    data = request.json
    user_id, username = user_ser.signin(data["email"], data["password"])
    return jsonify({"user_id": user_id, "username": username}), 200


### get user by id
@user_bp.route("/<user_id>", methods=["GET"])
def get_user(user_id):
    user = user_ser.get_user_by_id(user_id)
    return jsonify(user) if user else ("Not found", 404)


