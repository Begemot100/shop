from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager, UserMixin, login_user, login_required, current_user, logout_user
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import os

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://username:password@nozomi.proxy.rlwy.net:47023/Postgres-OQP9'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['SECRET_KEY'] = 'your_secret_key'

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

CORS(app)
# db = SQLAlchemy(app)
# db.init_app(app)
migrate = Migrate(app, db)

# Импортируем модели после инициализации db
import models
from models import User, Product, db

db.init_app(app)
with app.app_context():
    db.create_all()
# migrate = Migrate(app, db)  # 🔥 Подключаем Flask-Migrate



# Маршрут для регистрации
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

# Маршрут для логина
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

# Маршрут для логаута
@app.route("/logout")
@login_required
def logout():
    logout_user()  # Выход из системы
    return jsonify({"message": "Вы вышли из системы"}), 200

# Маршрут для панели администратора
@app.route("/admin")
@login_required
def admin_panel():
    if not current_user.is_admin():
        return jsonify({"error": "Доступ запрещен"}), 403
    return jsonify({"message": "Добро пожаловать в админку!"}), 200

# Маршрут для получения всех товаров
@app.route("/api/products", methods=["GET"])
def get_products():
    products = Product.query.all()
    return jsonify([{"id": p.id, "name": p.name, "price": p.price, "image": p.image} for p in products])



# Маршрут для получения новых товаров
@app.route('/api/products/new', methods=['GET'])
def get_new_products():
    try:
        # Запрос к базе данных для получения новых товаров
        new_products = Product.query.filter_by(is_new=True).all()  # Получаем новые товары
        products = []

        # Если товары найдены, формируем список
        for product in new_products:
            products.append({
                'id': product.id,
                'name': product.name,
                'price': product.price,
                'image': product.image,
                'is_new': product.is_new
            })

        # Если товары не найдены, возвращаем сообщение
        if not products:
            return jsonify({"message": "No new products found."}), 404

        # Возвращаем данные в формате JSON
        return jsonify(products)

    except Exception as e:
        # Обработка ошибок при выполнении запроса
        return jsonify({"error": str(e)}), 500



# Загрузка пользователя для Flask-Login
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

if __name__ == "__main__":
    with app.app_context():  # Используем контекст приложения
        db.create_all()  # Теперь create_all() будет работать корректно
    app.run(debug=True, port=5001)