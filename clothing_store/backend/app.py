from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager, UserMixin, login_user, login_required, current_user, logout_user

from flask_cors import CORS
from flask_bcrypt import Bcrypt
import os

app = Flask(__name__)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')

# app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(BASE_DIR, 'instance', 'store.db')}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
bcrypt = Bcrypt(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

CORS(app)
# db = SQLAlchemy(app)
# db.init_app(app)

# Импортируем модели после инициализации db
import models
from models import User, Product, db

db.init_app(app)
with app.app_context():
    db.create_all()
migrate = Migrate(app, db)  # 🔥 Подключаем Flask-Migrate



@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    print("📥 Полученные данные:", data)  # 🔥 Проверяем, приходят ли данные

    if not data or not data.get("name") or not data.get("email") or not data.get("password"):
        print("❌ Ошибка: Отсутствуют обязательные поля")
        return jsonify({"error": "Все поля обязательны"}), 400

    existing_user = User.query.filter_by(email=data["email"]).first()
    if existing_user:
        print("⚠️ Ошибка: Email уже зарегистрирован")
        return jsonify({"error": "Email уже зарегистрирован"}), 400

    hashed_password = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    new_user = User(name=data["name"], email=data["email"], password=hashed_password)

    print("📝 Добавляем пользователя:", new_user.name, new_user.email)

    with app.app_context():  # ✅ Контекст приложения
        db.session.add(new_user)
        db.session.commit()

    print("✅ Пользователь успешно сохранён в БД!")  # 🔥 Логируем успех

    return jsonify({"message": "Регистрация успешна!"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()  # Получаем данные в формате JSON
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password, password):  # Проверяем пароль
        login_user(user)  # Входим в систему
        if user.is_admin():
            return jsonify({"message": "Добро пожаловать в админку!", "redirect": "/admin"}), 200
        else:
            return jsonify({"message": "Добро пожаловать!", "redirect": "/dashboard"}), 200
    else:
        return jsonify({"error": "Неверный email или пароль"}), 401

@app.route("/logout")
@login_required
def logout():
    logout_user()  # Выход из системы
    return jsonify({"message": "Вы вышли из системы"}), 200

@app.route("/admin")
@login_required
def admin_panel():
    if not current_user.is_admin():
        return jsonify({"error": "Доступ запрещен"}), 403
    return jsonify({"message": "Добро пожаловать в админку!"}), 200

@app.route("/api/products", methods=["GET"])
def get_products():
    products = models.Product.query.all()
    return jsonify([{"id": p.id, "name": p.name, "price": p.price, "image": p.image} for p in products])

@app.route("/api/products/new", methods=["GET"])
def get_new_products():
    try:
        # Fetch new products where is_new is True
        new_products = Product.query.filter_by(is_new=True).all()

        # Print the fetched products to check the result
        print("Fetched products:", new_products)

        # If no products found, return an appropriate message
        if not new_products:
            return jsonify({"message": "No new products found."}), 404

        # Return the list of new products
        return jsonify([{
            "id": p.id,
            "name": p.name,
            "price": p.price,
            "image": p.image,
            "is_new": p.is_new
        } for p in new_products])

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

if __name__ == "__main__":
    with app.app_context():  # Используем контекст приложения
        db.create_all()  # Теперь create_all() будет работать корректно
    app.run(debug=True, port=5001)