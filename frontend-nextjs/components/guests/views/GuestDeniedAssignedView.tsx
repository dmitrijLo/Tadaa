import { Result } from "antd";

export default function GuestDeniedAssignedView({ guest }: { guest: Guest }) {
  return (
    <Result
      status="info"
      title="Auslosung beendet"
      subTitle="Schade, dass du nicht teilnehmen konntest. Die Wichtelpartner wurden bereits verteilt."
    />
  );
}
