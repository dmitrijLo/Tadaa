import { Card, Result, Typography } from "antd";
import { UserAddOutlined } from "@ant-design/icons";

const { Paragraph, Text } = Typography;
export default function GuestDeniedView({ guest }: { guest: Guest }) {
  return (
    <Card
      size="small"
      className="max-w-md w-full shadow-2xl animate-in fade-in duration-700"
    >
      <Result
        icon={<UserAddOutlined style={{ color: "#faad14" }} />}
        title="Du hast abgesagt"
        subTitle="Du bist aktuell als 'Nicht teilnehmend' markiert."
        extra={
          <div className="text-left bg-gray-50 p-4 rounded-lg border border-gray-100">
            <Paragraph type="secondary" className="text-sm m-0">
              <Text strong italic>
                Meinung geändert?
              </Text>{" "}
              <Text type="secondary">
                Kein Problem! Kontaktiere einfach den Host des Events, um deine
                Teilnahme zu reaktivieren.
              </Text>
            </Paragraph>
            <Paragraph type="secondary" className="text-sm m-0">
              Da die Auslosung noch nicht stattgefunden hat, kann der Host dich
              manuell wieder zur Liste hinzufügen.
            </Paragraph>
          </div>
        }
      />
    </Card>
  );
}
