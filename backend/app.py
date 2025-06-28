
from flask import Flask, request, jsonify
from flask_cors import CORS

from script.controller.category_controller import category_bp
from script.controller.recipe_controller import recipe_bp
from script.controller.user_controller import user_bp



def create_app():
    app = Flask(__name__)
    CORS(app)


    app.register_blueprint(category_bp, url_prefix="/category")
    app.register_blueprint(recipe_bp, url_prefix="/recipe")
    app.register_blueprint(user_bp, url_prefix="/user")

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
