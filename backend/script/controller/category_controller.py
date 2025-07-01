
from flask import Blueprint, jsonify
from flask_cors import CORS

from script.service.category_service import category_service


category_bp = Blueprint("category", __name__)
CORS(category_bp)
category_service = category_service()

### get all categories
@category_bp.route("/all", methods=["GET"])
def get_categories():
    return jsonify(category_service.get_categories())

### get all categories title
@category_bp.route("/title", methods=["GET"])
def get_categories_title():
    return jsonify(category_service.get_category_by_title())