import { Card, Space, Typography } from "antd";

const { Text, Paragraph, Title } = Typography;
export default function GuestDeniedView({ guest }: { guest: Guest }) {
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
