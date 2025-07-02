import copy
from datetime import datetime
import os
from typing import Any, Dict, List, Optional
import uuid
from flask import json

DEFAULT_RECIPE_TEMPLATE = {
    "id": None,
    "title": None,
    "description": None,
    "image": None,
    "ingredients": [],
    "instructions": None,
    "cooking_time": None,
    "servings": None,
    "category": None,
    "total_score": 0,
    "number_of_rating": 0,
    "avg_rating": 0.0,
    "nutritional_info": {
        "calories": None,
        "protein": None,
        "fat": None,
        "carbs": None
    },
    "comments": [],
    "tags": [],
    "share_url": None,
    "posted_by": None
}

class recipe_service:
    def __init__(self, storage_dir: str = "data/recipe"):
        self.storage_dir = storage_dir
        os.makedirs(self.storage_dir, exist_ok=True)

    @staticmethod
    def apply_default_schema(recipe: dict) -> dict:
        def deep_merge(default: dict, actual: dict):
            result = copy.deepcopy(default)
            for key, value in actual.items():
                if isinstance(value, dict) and key in result:
                    result[key] = deep_merge(result.get(key, {}), value)
                else:
                    result[key] = value
            return result

        return deep_merge(DEFAULT_RECIPE_TEMPLATE, recipe)

    def _get_recipe_path(self, recipe_id: str) -> str:
        return os.path.join(self.storage_dir, f"{recipe_id}.json")

    def add_recipe(self, recipe_data: Dict[str, Any], username : str) -> str:
        if not recipe_data or not isinstance(recipe_data, dict):
            raise ValueError("Invalid recipe data") 
        recipe_id = str(uuid.uuid4())
        recipe_data["id"] = recipe_id
        recipe_data["posted_by"] = username
        full_recipe = self.apply_default_schema(recipe_data)
        recipe_path = self._get_recipe_path(recipe_id)
        with open(recipe_path, "w", encoding="utf-8") as f:
            json.dump(full_recipe, f, indent=2, ensure_ascii=False)
        return recipe_id

    def delete_recipe(self, recipe_id: str) -> bool:
        recipe_path = self._get_recipe_path(recipe_id)
        if os.path.exists(recipe_path):
            os.remove(recipe_path)
            return True
        return False

    
    def update_recipe(self, recipe_id: str, updates: Dict[str, Any]) -> bool:
        recipe_path = self._get_recipe_path(recipe_id)
        if not os.path.exists(recipe_path):
            return False
        with open(recipe_path, "r", encoding="utf-8") as f:
            recipe = json.load(f)

        # Cập nhật sâu nếu cần
        def deep_update(d: dict, u: dict):
            for k, v in u.items():
                if isinstance(v, dict) and isinstance(d.get(k), dict):
                    deep_update(d[k], v)
                else:
                    d[k] = v

        deep_update(recipe, updates)

        with open(recipe_path, "w", encoding="utf-8") as f:
            json.dump(recipe, f, indent=2, ensure_ascii=False)
        return True
 
    def add_review(self,recipe_id, review: Dict[str, Any]) -> bool:
        recipe_path = self._get_recipe_path(recipe_id)
        if not os.path.exists(recipe_path):
            return False
        with open(recipe_path, "r", encoding="utf-8") as f:
            recipe = json.load(f)
        comment = {
            "username": review["userName"] ,
            "text": review["comment"],
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        rating = review["rating"]
        recipe["total_score"] += rating
        recipe["number_of_rating"] += 1
        recipe["avg_rating"] = recipe["total_score"] / recipe["number_of_rating"]
        recipe["comments"].append(comment)
        with open(recipe_path, "w", encoding="utf-8") as f:
            json.dump(recipe, f, indent=2, ensure_ascii=False)
        return True

    def get_recipe_by_id(self, recipe_id: str) -> Optional[Dict[str, Any]]:
        try:
            recipe_path = self._get_recipe_path(recipe_id)
            if not os.path.exists(recipe_path):
                return None
            with open(recipe_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError) as e:
            # Log error hoặc handle appropriately
            return None

    def get_all_recipes(self) -> List[Dict[str, Any]]:
        recipes = []
        for filename in os.listdir(self.storage_dir):
            if filename.endswith(".json"):
                with open(os.path.join(self.storage_dir, filename), "r", encoding="utf-8") as f:
                    recipes.append(json.load(f))
        return recipes

    def get_favorite_recipes(self, user_favorites: List[str]) -> List[Dict[str, Any]]:
        favorite_recipes = []
        for recipe_id in user_favorites:
            recipe = self.get_recipe_by_id(recipe_id)
            if recipe:
                favorite_recipes.append({
                    "id": recipe["id"],
                    "title": recipe["title"],
                    "image": recipe["image"],
                    "avg_rating": recipe["avg_rating"],
                    "description": recipe["description"],
                    "posted_by": recipe["posted_by"]
                })
        return favorite_recipes
    
    def get_sort_by_name(self, dimension: str) -> List[Dict[str, Any]]:
        recipes = self.get_all_recipes()
        if dimension == "ascending":
            return sorted(recipes, key=lambda recipe: recipe["title"])
        else:
            return sorted(recipes, key=lambda recipe: recipe["title"], reverse=True)

    def get_sort_by_rating(self, dimension: str) -> List[Dict[str, Any]]:
        recipes = self.get_all_recipes()
        if dimension == "ascending":
            return sorted(recipes, key=lambda recipe: recipe["avg_rating"])
        else:
            return sorted(recipes, key=lambda recipe: recipe["avg_rating"], reverse=True)
        
    def get_filter_by_category(self, category: str) -> List[Dict[str, Any]]:
        recipes = self.get_all_recipes()
        return [recipe for recipe in recipes if category in recipe["category"] ]
    
    def get_all_recipes_by_username(self, username: str) -> List[Dict[str, Any]]:
       
        recipes = []
        for filename in os.listdir(self.storage_dir):
            if filename.endswith(".json"):
                with open(os.path.join(self.storage_dir, filename), "r", encoding="utf-8") as f:
                    recipe = json.load(f)
                    if recipe["posted_by"] == username:
                        recipes.append(recipe)
        return recipes