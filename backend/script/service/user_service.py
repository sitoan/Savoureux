import os
import uuid
import json
import copy

DEFAULT_USER_TEMPLATE = {
    "id": None,
    "username": "",
    "email": "",
    "password": "",
    "avatar": "",

    "favorites": [],  # Danh sách recipe_id yêu thích
    "ratings": [],  # Danh sách {recipe_id, score}
    "meal_plans": [],  # Kế hoạch bữa ăn theo ngày
    "comments": [],  # Bình luận người dùng đã viết

    "preferences": {
        "diet": "none",  # hoặc "vegetarian", "keto", "low-carb"
        "allergies": []  # Danh sách chất gây dị ứng
    },

    "view_history": {},  # Mỗi recipe_id sẽ có thông tin view riêng
    "recipe_created": []
}


class user_service:
    def __init__(self, storage_dir="data/user"):
        self.storage_dir = storage_dir
        os.makedirs(self.storage_dir, exist_ok=True)

    def _get_user_path(self, user_id: str) -> str:
        return os.path.join(self.storage_dir, f"{user_id}.json")

    def apply_default_schema(self, user: dict) -> dict:
        def deep_merge(default: dict, actual: dict):
            result = copy.deepcopy(default)
            for key, value in actual.items():
                if isinstance(value, dict) and key in result:
                    result[key] = deep_merge(result.get(key, {}), value)
                else:
                    result[key] = value
            return result
        return deep_merge(DEFAULT_USER_TEMPLATE, user)
    
    def get_all_users(self) -> list:
        users = []
        for filename in os.listdir(self.storage_dir):
            if filename.endswith(".json"):
                with open(os.path.join(self.storage_dir, filename), "r", encoding="utf-8") as f:
                    users.append(json.load(f))
        return users

    def add_user(self, user_data: dict) -> str:
        user_id = str(uuid.uuid4())
        user_data["id"] = user_id
        user_data = self.apply_default_schema(user_data)
        with open(self._get_user_path(user_id), "w", encoding="utf-8") as f:
            json.dump(user_data, f, indent=2, ensure_ascii=False)
        return user_id

    def get_user_by_id(self, user_id: str) -> dict | None:
        path = self._get_user_path(user_id)
        if not os.path.exists(path):
            return None
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    def update_user(self, user_id: str, user_data: dict) -> bool:
        path = self._get_user_path(user_id)
        if not os.path.exists(path):
            return False
        with open(path, "w", encoding="utf-8") as f:
            json.dump(user_data, f, indent=2, ensure_ascii=False)
        return True

    def get_user_favorite_recipes(self, user_id: str) -> list:
        user = self.get_user_by_id(user_id)
        print(user["favorites"])
        return user["favorites"]
    

    def signin(self, email, password):
        users = self.get_all_users()
        for user in users:
            if user["email"] == email and user["password"] == password:
                return user["id"], user["username"]
        return None
    
    def get_user_by_id(self, user_id: str) -> dict | None:
        path = self._get_user_path(user_id)
        if not os.path.exists(path):
            return None
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
        
    def add_favorite_recipe(self, user_id, recipe_id):
        user = self.get_user_by_id(user_id)
        user["favorites"].append(recipe_id)
        self.update_user(user_id, user)

    def remove_favorite_recipe(self, user_id, recipe_id):
        user = self.get_user_by_id(user_id)
        user["favorites"].remove(recipe_id if recipe_id in user["favorites"] else None)
        self.update_user(user_id, user)

    def is_favorite_recipe(self, user_id, recipe_id):
        user = self.get_user_by_id(user_id)
        return recipe_id in user["favorites"]
    
    def get_meal_plans(self, user_id):
        user = self.get_user_by_id(user_id)
        return user["meal_plans"]
    

    #input {'source_date': '2025-07-02', 'source_meal_type': 'lunch', 'target_date': '2025-07-03', 'target_meal_type': 'lunch', 'recipe_id': 'ffb15397-027e-461c-bb7d-0647bd42f819'}
    def update_meal_plans(self, user_id, meal_plans):
        user = self.get_user_by_id(user_id)
        for meal_plan in meal_plans:
            if meal_plan["target_date"] not in [mp["date"] for mp in user["meal_plans"]]:
                user["meal_plans"].append({"date": meal_plan["target_date"], "meals": [{"type": meal_plan["target_meal_type"], "recipe_id": meal_plan["recipe_id"]}]})
            else:
                for mp in user["meal_plans"]:
                    if mp["date"] == meal_plan["target_date"]:
                        for meal in mp["meals"]:
                            if meal["type"] == meal_plan["target_meal_type"]:
                                meal["recipe_id"] = meal_plan["recipe_id"]
                                break
        self.update_user(user_id, user)

#{'date': '2025-07-02', 'meal_type': 'dinner'}
    def remove_meal_plans(self, user_id, meal_plans):
        user = self.get_user_by_id(user_id)
        for meal_plan in meal_plans:
            for mp in user["meal_plans"]:
                if mp["date"] == meal_plan["date"]:
                    for meal in mp["meals"]:
                        if meal["type"] == meal_plan["meal_type"]:
                            mp["meals"].remove(meal)
                            break
        self.update_user(user_id, user)

    def add_meal_plans(self, user_id, meal_plans):
        user = self.get_user_by_id(user_id)
        user["meal_plans"].append(meal_plans)
        self.update_user(user_id, user)

    def add_commented_recipe(self, user_id, recipe_id, review):
        user = self.get_user_by_id(user_id)
        user["comments"].append({"recipe_id": recipe_id, "comment": review["comment"]})
        user["ratings"].append({"recipe_id": recipe_id, "rating": review["rating"]})
        self.update_user(user_id, user)
    
    def get_user_profile(self, user_id):
        user = self.get_user_by_id(user_id)
        user_profile = {
            "username": user["username"],
            "email": user["email"],
            "avatar": user["avatar"],
            "preferences": user["preferences"]
        }
        return user_profile
    
    def get_user_activity(self, user_id):
        user = self.get_user_by_id(user_id)
        user_activity = {
            "number_of_recipes_created" : len(user["recipe_created"]),
            "number_of_recipes_commented": len(user["comments"]),
            "number_of_recipes_rated": len(user["ratings"]),
            "recipe_created": [recipe["recipe_id"] for recipe in user["recipe_created"]],
            "recipe_commented": [recipe["recipe_id"] for recipe in user["comments"]],
        }
        print(user_activity)
        return user_activity
    
    def update_user(self, user_id, updated_user):
        path = self._get_user_path(user_id)
        user = self.get_user_by_id(user_id)
        def deep_merge(default: dict, actual: dict):
            result = copy.deepcopy(default)
            for key, value in actual.items():
                if isinstance(value, dict) and key in result:
                    result[key] = deep_merge(result.get(key, {}), value)
                else:
                    result[key] = value
            return result

        updated_user = deep_merge(user, updated_user)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(updated_user, f, indent=2, ensure_ascii=False)
