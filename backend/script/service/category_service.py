

CATEGORY = [
    {
        "title":"Asian Inspired",
        "image":"https://i.ibb.co/1tZcx7Ng/Asian-Inspired.png",
    },
    {
        "title": "Breakfast",
        "image": "https://i.ibb.co/ynThNFNB/Breakfast.png",
    },
    {
        "title": "Desserts & Baked Goods",
        "image":"https://i.ibb.co/FbPHbKyW/Desserts-And-Baked-Goods.png",
    },
    {
        "title": "Indian Inspired",
        "image": "https://i.ibb.co/W41SZqFt/Indian-Inspired.png",
    },
    {
        "title": "Meat Dishes",
        "image": "https://i.ibb.co/nsSBV2jp/Meat-Dishes.png",
    },
    {
        "title": "Mexican Inspired",
        "image": "https://i.ibb.co/hFFQDMwR/Mexican-Inspired.png",
    },
    {
        "title": "Pasta & Noodles",
        "image": "https://i.ibb.co/357hCfpp/Pasta-And-Noodles.png",
    },
    {
        "title": "Salads",
        "image": "https://i.ibb.co/0pgqvcKk/Salads.png",
    },
    {
        "title":  "Soups & Stews",
        "image": "https://i.ibb.co/RphD426m/Soups-And-Stews.png",
    },
    {
        "title": "Vegetarian",
        "image":  "https://i.ibb.co/HTdLzSVM/Vegetarian.png"
    }
]
class category_service:
    def __init__(self):
        pass

    def get_categories(self):
        return CATEGORY
    
    def get_category_by_title(self):
        return [category["title"] for category in CATEGORY]