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

    "view_history": {}  # Mỗi recipe_id sẽ có thông tin view riêng
}


class user_controller:
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
