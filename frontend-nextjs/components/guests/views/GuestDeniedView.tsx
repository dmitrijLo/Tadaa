import { Card, Space, Typography } from "antd";

const { Text, Paragraph, Title } = Typography;
export default function GuestDeniedView({ guest }: { guest: Guest }) {
  const { event } = guest;

  const isEventOver = new Date(event.eventDate) < new Date();
 

  //   Event ist abgelaufen
  if (event.status === "done" || isEventOver) {
    return (
      <Card>
        <Paragraph>
          Schade, dass du nicht teilnehmen konntest. Das Event hat bereits
          stattgefunden.
        </Paragraph>
      </Card>
    );
  }

  //   Auslosung ist abgeschlossen
  if (event.status === "assigned") {
    return (
      <Card>
        <Paragraph>
          Schade, dass du nicht teilnehmen konntest. Die Auslosung ist bereits
          abgeschlossen und die Wichtelpartner wurden verteilt.
        </Paragraph>
      </Card>
    );
  }

  //   Einladung abgelehnt, Event steht noch bevor, Host kann kontaktiert werden
  return (
    <Card>
      <Paragraph>
        <Space orientation="vertical" size="small">
          <Title level={4} style={{ margin: 0 }}>
            Du hast abgesagt
          </Title>
          <Text type="secondary">
            Du bist aktuell als 'Nicht teilnehmend' markiert.
          </Text>
        </Space>
      </Paragraph>
      <Paragraph style={{ marginBottom: 0 }}>
        Möchtest du deine Meinung ändern? Da die Auslosung noch nicht
        stattgefunden hat, kann der Host dich manuell wieder zur Liste
        hinzufügen.
      </Paragraph>
    </Card>
  );
}
