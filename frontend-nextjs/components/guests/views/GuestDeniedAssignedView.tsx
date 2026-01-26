import { Card, Typography } from "antd";

const { Paragraph } = Typography;

export default function GuestDeniedAssignedView({ guest }: { guest: Guest }) {
  return (
    <Card
      size="small"
      className="max-w-md w-full shadow-2xl animate-in fade-in duration-700"
    >
      <Paragraph>
        Schade, dass du nicht teilnehmen konntest. Die Auslosung ist bereits
        abgeschlossen und die Wichtelpartner wurden verteilt.
      </Paragraph>
    </Card>
  );
}
