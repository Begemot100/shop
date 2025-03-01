import { signIn } from "next-auth/client";

export default function SignIn() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Вход в админку</h1>
      <button
        onClick={() => signIn()}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Войти
      </button>
    </div>
  );
}