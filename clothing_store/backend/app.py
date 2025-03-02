from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager, UserMixin, login_user, login_required, current_user, logout_user
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import os

# Инициализация приложения
app = Flask(__name__)

# Конфигурация для PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://username:password@nozomi.proxy.rlwy.net:47023/Postgres-OQP9'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['SECRET_KEY'] = 'your_secret_key'  # Для безопасности

# Инициализация необходимых расширений
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

CORS(app)
migrate = Migrate(app, db)

# Импортируем модели после инициализации db
import models
from models import User, Product, db

db.init_app(app)

# Создание всех таблиц, если они еще не созданы
with app.app_context():
    db.create_all()

# Регистрация нового пользователя
@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data or not data.get("name") or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Все поля обязательны"}), 400

    existing_user = User.query.filter_by(email=data["email"]).first()
    if existing_user:
        return jsonify({"error": "Email уже зарегистрирован"}), 400

    hashed_password = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    new_user = User(name=data["name"], email=data["email"], password=hashed_password)

    with app.app_context():
        db.session.add(new_user)
        db.session.commit()

    return jsonify({"message": "Регистрация успешна!"}), 201

# Логин пользователя
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password, password):
        login_user(user)
        if user.is_admin():
            return jsonify({"message": "Добро пожаловать в админку!", "redirect": "/admin"}), 200
        else:
            return jsonify({"message": "Добро пожаловать!", "redirect": "/dashboard"}), 200
    else:
        return jsonify({"error": "Неверный email или пароль"}), 401

# Логаут
@app.route("/logout")
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Вы вышли из системы"}), 200

# Панель администратора
@app.route("/admin")
@login_required
def admin_panel():
    if not current_user.is_admin():
        return jsonify({"error": "Доступ запрещен"}), 403
    return jsonify({"message": "Добро пожаловать в админку!"}), 200

# Получить все товары
@app.route("/api/products", methods=["GET"])
def get_products():
    products = Product.query.all()
    return jsonify([{"id": p.id, "name": p.name, "price": p.price, "image": p.image} for p in products])

# Получить новые товары
@app.route('/api/products/new', methods=['GET'])
def get_new_products():
    try:
        new_products = Product.query.filter_by(is_new=True).all()
        products = []

        for product in new_products:
            products.append({
                'id': product.id,
                'name': product.name,
                'price': product.price,
                'image': product.image,
                'is_new': product.is_new
            })

        if not products:
            return jsonify({"message": "No new products found."}), 404

        return jsonify(products)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Загрузка пользователя для Flask-Login
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5001)