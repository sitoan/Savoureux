from flask import Blueprint, request, jsonify
from script.service.recipe_service import recipe_service

recipe_bp = Blueprint("recipe", __name__)
recipe_service = recipe_service()


### create recipe
@recipe_bp.route("/create", methods=["POST"])
def add_recipe():
    data = request.json
    recipe_id = recipe_service.add_recipe(data)
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


### rate recipe by id
@recipe_bp.route("/<recipe_id>/rate", methods=["POST"])
def rate_recipe(recipe_id):
    rating = request.json.get("rating", 0)
    success = recipe_service.update_rating(recipe_id, rating)
    return ("Rated", 200) if success else ("Not found", 404)

### comment recipe by id
@recipe_bp.route("/<recipe_id>/comment", methods=["POST"])
def add_comment(recipe_id):
    comment = request.json
    success = recipe_service.add_comment(recipe_id, comment)
    return ("Commented", 200) if success else ("Not found", 404)
