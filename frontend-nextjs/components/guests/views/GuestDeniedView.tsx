import { Card, Space, Typography } from "antd";

const { Paragraph, Title } = Typography;
export default function GuestDeniedView({ guest }: { guest: Guest }) {
  return (
    <Card
      size="small"
      className="max-w-md w-full shadow-2xl animate-in fade-in duration-700"
    >
      <Title level={2} style={{ marginBottom: "16px" }}>
        Du hast abgesagt
      </Title>
      <Paragraph type="secondary">
        Du bist aktuell als 'Nicht teilnehmend' markiert.
      </Paragraph>
      <Paragraph type="secondary" style={{ marginBottom: 0 }}>
        Hast du deine Meinung geändert? Da die Auslosung noch nicht
        stattgefunden hat, kann der Host dich manuell wieder zur Liste
        hinzufügen.
      </Paragraph>
    </Card>
  );
}
