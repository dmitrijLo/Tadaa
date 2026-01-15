"use client";

import { Card, Form, Tag } from "antd";

export default function InterestPicker({
  interests,
}: {
  interests: InterestOption[] | undefined;
}) {
  return (
    <Card title="Choose your interests" size="small">
      <Form>
        <Form.Item>
          <Tag.CheckableTagGroup
            multiple
            options={interests && interests.map((interest) => interest.name)}
          />
        </Form.Item>
      </Form>
    </Card>
  );
}
