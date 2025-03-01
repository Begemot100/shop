export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        const response = await fetch("http://127.0.0.1:5001/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: response.status });
    } catch (error) {
        console.error("Ошибка при регистрации:", error);
        return new Response(
            JSON.stringify({ message: "Ошибка сервера" }),
            { status: 500 }
        );
    }
}