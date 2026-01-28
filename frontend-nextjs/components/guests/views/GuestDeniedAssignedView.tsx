import { Card, Result } from "antd";

export default function GuestDeniedAssignedView({ guest }: { guest: Guest }) {
  return (
    <Card className="max-w-md w-full shadow-2xl animate-in fade-in duration-700">
      <Result
        status="info"
        title="Auslosung beendet"
        subTitle="Schade, dass du nicht teilnehmen konntest. Die Wichtelpartner wurden bereits verteilt."
      />
    </Card>
  );
}
