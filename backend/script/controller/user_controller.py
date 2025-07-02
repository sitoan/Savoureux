
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


### add favorite recipe
@user_bp.route("/<user_id>/favorite/<recipe_id>/add", methods=["PUT"])
def add_favorite_recipe(user_id, recipe_id):
    user_ser.add_favorite_recipe(user_id, recipe_id)
    return ("Added", 200)

### remove favorite recipe
@user_bp.route("/<user_id>/favorite/<recipe_id>/remove", methods=["PUT"])
def remove_favorite_recipe(user_id, recipe_id):
    user_ser.remove_favorite_recipe(user_id, recipe_id)
    return ("Removed", 200)

### check favorite recipe
@user_bp.route("/<user_id>/favorite/<recipe_id>", methods=["GET"])
def check_favorite_recipe(user_id, recipe_id):
    return jsonify(user_ser.is_favorite_recipe(user_id, recipe_id))

### get meal plans
@user_bp.route("/<user_id>/meal_plans", methods=["GET"])
def get_meal_plans(user_id):
    return jsonify(user_ser.get_meal_plans(user_id))

### update meal plans
@user_bp.route("/<user_id>/meal_plans", methods=["PUT"])
def update_meal_plans(user_id):
    data = request.json
    print(data)
    user_ser.update_meal_plans(user_id, data)
    return ("Updated", 200)

### remove meal plans
@user_bp.route("/<user_id>/meal_plans/", methods=["DELETE"])
def remove_meal_plans(user_id):
    data = request.json
    print(data)
    user_ser.remove_meal_plans(user_id,data )
    return ("Removed", 200)

### add meal plans
@user_bp.route("/<user_id>/meal_plans/", methods=["POST"])
def add_meal_plans(user_id):
    data = request.json
    print(data)
    user_ser.add_meal_plans(user_id, data)
    return ("Added", 200)

### get user profile
@user_bp.route("/<user_id>/profile", methods=["GET"])    
def get_user_profile(user_id):
    return jsonify(user_ser.get_user_profile(user_id))

### get user activity
@user_bp.route("/<user_id>/activity", methods=["GET"])    
def get_user_activity(user_id):
    data = user_ser.get_user_activity(user_id)
    print(data)
    list_recipes = recipe_ser.get_favorite_recipes(list( set(data["recipe_created"]).union(set(data["recipe_commented"])))) 
    dataMap = {
        "number_of_recipes_created" : data["number_of_recipes_created"],
        "number_of_recipes_commented": data["number_of_recipes_commented"],
        "number_of_recipes_rated": data["number_of_recipes_rated"],
        "recipes": list_recipes
    }
    return dataMap

### update user
@user_bp.route("/<user_id>/profile", methods=["PUT"])
def update_user(user_id):
    data = request.json
    user_ser.update_user(user_id, data)
    return ("Updated", 200)