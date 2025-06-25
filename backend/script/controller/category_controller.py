
from flask import Blueprint, jsonify

from script.service.category_service import category_service


category_bp = Blueprint("category", __name__)
category_service = category_service()

### get all categories
@category_bp.route("/all", methods=["GET"])
def get_categories():
    return jsonify(category_service.get_categories())
