import { Card, Typography } from "antd";

const { Paragraph } = Typography;

export default function GuestDeniedAssignedView({ guest }: { guest: Guest }) {
  return (
    <Card>
      <Paragraph>
        Schade, dass du nicht teilnehmen konntest. Die Auslosung ist bereits
        abgeschlossen und die Wichtelpartner wurden verteilt.
      </Paragraph>
    </Card>
  );
}
