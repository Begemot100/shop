export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: "Все поля обязательны" }), { status: 400 });
    }

    // Пример фейкового сохранения пользователя (замени на свою логику)
    const newUser = { name, email, password };

    return new Response(JSON.stringify(newUser), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Ошибка сервера" }), { status: 500 });
  }
}