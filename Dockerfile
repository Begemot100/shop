# Используем базовый образ для Python
FROM python:3.9-slim AS backend

# Устанавливаем рабочую директорию для backend
WORKDIR /app/backend

# Копируем и устанавливаем зависимости для Flask
COPY backend/requirements.txt /app/backend/
RUN pip install --no-cache-dir -r requirements.txt

# Копируем весь код backend
COPY backend /app/backend

# Используем базовый образ для Node.js
FROM node:18 AS frontend

# Устанавливаем рабочую директорию для frontend
WORKDIR /app/frontend

# Копируем и устанавливаем зависимости для фронтенда
COPY frontend/package.json /app/frontend/
COPY frontend/package-lock.json /app/frontend/
RUN npm install

# Копируем весь код фронтенда
COPY frontend /app/frontend

# Устанавливаем переменные окружения для работы с фронтендом и backend
ENV FLASK_APP=backend/app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Открываем порты для Flask и фронтенда
EXPOSE 5000 3000

# Стартуем оба процесса — Flask и npm run dev для фронтенда
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:5000 backend.app:app & npm run dev --prefix /app/frontend"]