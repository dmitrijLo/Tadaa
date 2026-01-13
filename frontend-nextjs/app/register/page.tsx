
import Link from "next/link";
import RegisterForm from "@/components/forms/RegisterForm";



export default function RegisterPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          padding: "40px",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h1 level={2} style={{ textAlign: "center", marginBottom: "30px" }}>
          Create Account
        </h1>

        <RegisterForm />

        <h3 style={{ textAlign: "center", marginTop: "20px" }}>
          <p style={{ marginBottom: "0" }}>
            Already have an account? <Link href="/login">Sign in</Link>
          </p>
        </h3>
      </div>
    </div>
  );
}