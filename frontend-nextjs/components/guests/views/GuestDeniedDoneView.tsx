import { Result } from "antd";

export default function GuestDeniedDoneView({ guest }: { guest: Guest }) {
  return (
    <Result
      status="info"
      title="Event beendet"
      subTitle="Schade, dass du nicht teilnehmen konntest. Das Event hat bereits stattgefunden."
    />
  );
}
