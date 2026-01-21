"use client";

import { Form, Input, Button, Divider, Typography } from "antd";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { useInterestStore } from "@/stores/useInterestStore";

const { Text, Paragraph } = Typography;

export default function InterestNoteComponent({
  guestId,
}: {
  guestId: string;
}) {
  if (!guestId) notFound();

  const { submitNoteForGiver, noteForGiver } = useInterestStore();
  const [note, setNote] = useState(noteForGiver);

  useEffect(() => {
    setNote(noteForGiver);
  }, [noteForGiver]);

  const handleSubmit = async () => {
    await submitNoteForGiver(guestId, note);
  };

  return (
    <>
      <Paragraph>
        <Text type="secondary">Leave a note for your wichtel:</Text>
      </Paragraph>
      <Form layout="inline" onFinish={handleSubmit}>
        <Form.Item style={{ flex: 1, marginRight: "8px" }}>
          <Input
            placeholder={noteForGiver}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Divider />
    </>
  );
}
