import { Card, Result } from "antd";

export default function GuestDeniedDoneView({ guest }: { guest: Guest }) {
  return (
    <Card className="max-w-md w-full shadow-2xl animate-in fade-in duration-700">
      <Result
        status="info"
        title="Event beendet"
        subTitle="Schade, dass du nicht teilnehmen konntest. Das Event hat bereits
        stattgefunden."
      />
    </Card>
  );
}
