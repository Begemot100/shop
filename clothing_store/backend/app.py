from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager, UserMixin, login_user, login_required, current_user, logout_user
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import os
from models import User, Product, ActivityLog, db

# Инициализация приложения
app = Flask(__name__)

# Конфигурация для PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:gYYcSjYNpYYvpmNvsMaVgpnSupkjrhzS@nozomi.proxy.rlwy.net:47023/railway'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['SECRET_KEY'] = 'your_secret_key'  # Для безопасности

# Инициализация необходимых расширений
db.init_app(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

CORS(app)
migrate = Migrate(app, db)

# Импортируем модели после инициализации db
import models

# db.init_app(app)

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
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()  # Получаем данные в формате JSON
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password, password):  # Проверяем пароль
        login_user(user)  # Входим в систему
        if user.is_admin():
            return jsonify({"message": "Добро пожаловать в админку!", "redirect": "/admin"}), 200
        else:
            return jsonify({"message": "Добро пожаловать!", "redirect": "/dashboard"}), 200
    else:
        return jsonify({"error": "Неверный email или пароль"}), 401

@app.route('/api/auth/_log', methods=['POST'])
def log_activity():
    try:
        # Получаем данные из запроса
        data = request.get_json()
        print("📝 Логирование активности:", data)  # Выводим данные в консоль

        # Проверяем, что все необходимые поля присутствуют
        if not data or not data.get("user_id") or not data.get("action"):
            return jsonify({"error": "Отсутствуют обязательные поля: user_id или action"}), 400

        # Сохраняем лог в базе данных
        log_entry = ActivityLog(user_id=data["user_id"], action=data["action"])
        db.session.add(log_entry)
        db.session.commit()

        print(f"✅ Лог активности добавлен для пользователя {data['user_id']}")

        # Возвращаем успешный ответ
        return jsonify({"message": "Логирование выполнено успешно"}), 200

    except Exception as e:
        print(f"❌ Ошибка при логировании: {str(e)}")
        return jsonify({"error": "Ошибка сервера"}), 500

# 1
# Логаут
@app.route("/logout")
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Вы вышли из системы"}), 200

# @app.route('/api/auth/session', methods=['GET'])
# @login_required  # Убедитесь, что только авторизованные пользователи могут получить доступ к сессии
# def get_session():
#     return jsonify({
#         'user_id': current_user.id,
#         'user_email': current_user.email,
#         'message': 'Session active'
#     }), 200

# Панель администратора
@app.route("/admin")
@login_required
def admin_panel():
    if not current_user.is_admin():
        return jsonify({"error": "Доступ запрещен"}), 403
    return jsonify({"message": "Добро пожаловать в админку!"}), 200

@app.route('/api/auth/session', methods=['GET'])
def get_session():
    if current_user.is_authenticated:
        return jsonify({
            'id': current_user.id,
            'name': current_user.name,
            'email': current_user.email
        })
    return jsonify({'message': 'No active session'}), 401

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
    app.run(debug=True, port=8080)