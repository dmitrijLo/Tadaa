import { Card, Typography } from "antd";

const { Paragraph } = Typography;

export default function GuestDeniedDoneView({ guest }: { guest: Guest }) {
  return (
    <Card>
      <Paragraph>
        Schade, dass du nicht teilnehmen konntest. Das Event hat bereits
        stattgefunden.
      </Paragraph>
    </Card>
  );
}
