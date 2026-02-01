import { Result, Typography } from "antd";
import { GiftOutlined } from "@ant-design/icons";

const { Paragraph, Text } = Typography;

export default function GuestEventDoneView({ guest }: { guest: Guest }) {
  return (
    <Result
      icon={<GiftOutlined style={{ color: "#52c41a" }} />}
      title="Event abgeschlossen!"
      subTitle={
        <div className="text-center">
          <Paragraph>
            Das Event <Text strong>{guest.event.name}</Text> ist beendet.
          </Paragraph>
          <Paragraph type="secondary">
            Wir hoffen, du hattest eine tolle Zeit beim Geschenkeaustausch!
          </Paragraph>
        </div>
      }
    />
  );
}
