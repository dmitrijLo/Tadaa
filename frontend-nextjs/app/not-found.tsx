import Link from "next/link";
import { Button, Result } from "antd";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle="Entschuldigung, die besuchte Seite existiert nicht."
        extra={
          <Link href="/">
            <Button type="primary">Zurück zur Startseite</Button>
          </Link>
        }
      />
    </div>
  );
}
