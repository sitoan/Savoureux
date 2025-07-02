from flask import Blueprint, request, jsonify
from flask_cors import CORS
from script.service.user_service import user_service
from script.service.recipe_service import recipe_service

recipe_bp = Blueprint("recipe", __name__)
CORS(recipe_bp)
recipe_service = recipe_service()
user_service = user_service()


### create recipe
@recipe_bp.route("/create/<user_id>", methods=["POST"])
def add_recipe(user_id):
    username = user_service.get_user_by_id(user_id)["username"]
    data = request.json
    recipe_id = recipe_service.add_recipe(data, username)
    user_service.add_recipe_created(user_id, recipe_id)
    return jsonify({"recipe_id": recipe_id}), 201


### get recipe by id
@recipe_bp.route("/<recipe_id>", methods=["GET"])
def get_recipe(recipe_id):
    recipe = recipe_service.get_recipe_by_id(recipe_id)
    return jsonify(recipe) if recipe else ("Not found", 404)


### get all recipes
@recipe_bp.route("/all", methods=["GET"])
def get_all_recipes():
    return jsonify(recipe_service.get_all_recipes())


### update recipe by id
@recipe_bp.route("/<recipe_id>", methods=["PUT"])
def update_recipe(recipe_id):
    updates = request.json
    success = recipe_service.update_recipe(recipe_id, updates)
    return ("Updated", 200) if success else ("Not found", 404)


### delete recipe by id
@recipe_bp.route("/<recipe_id>", methods=["DELETE"])
def delete_recipe(recipe_id):
    success = recipe_service.delete_recipe(recipe_id)
    return ("Deleted", 200) if success else ("Not found", 404)


### review recipe by id
@recipe_bp.route("/<recipe_id>/review", methods=["POST"])
def add_comment(recipe_id):
    review = request.json
    success = recipe_service.add_review(recipe_id, review)
    user_service.add_commented_recipe(review["user_id"], recipe_id, review)
    return ("Commented", 200) if success else ("Not found", 404)

### get name sort recipes
@recipe_bp.route("/sort/name", methods=["GET"])
def get_filter_by_name():
    dimension = request.headers.get("dimension")
    return jsonify(recipe_service.get_sort_by_name(dimension))

### get rating sort recipes
@recipe_bp.route("/sort/rating", methods=["GET"])
def get_filter_by_rating():
    dimension = request.headers.get("dimension")
    return jsonify(recipe_service.get_sort_by_rating(dimension))

### get category filter recipes
@recipe_bp.route("/filter/category", methods=["GET"])
def get_filter_by_category():
    category = request.headers.get("category")
    return jsonify(recipe_service.get_filter_by_category(category))

### get all recipes by user
@recipe_bp.route("/all/<user_id>", methods=["GET"])
def get_all_recipes_by_userid(user_id):
    # get username from user_id
    username = user_service.get_user_by_id(user_id)["username"]
    # get all recipes by username
    return jsonify(recipe_service.get_all_recipes_by_username(username))

