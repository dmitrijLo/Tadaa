"use client";

import { Card, Divider, Form, Tag, Flex } from "antd";
import React from "react";
const { CheckableTag } = Tag;

export default function InterestPicker({
  interests,
}: {
  interests: { name: string; id: string }[] | undefined;
}) {
  const [likes, setLikes] = React.useState<string[]>([]);
  const [dislikes, setDislikes] = React.useState<string[]>([]);

  const handleToggle = (
    name: string,
    list: string[],
    setList: (val: string[]) => void,
  ) => {
    const nextSelectedTags = list.includes(name)
      ? list.filter((t) => t !== name)
      : [...list, name];
    setList(nextSelectedTags);
  };

  const renderTags = (
    type: "like" | "dislike",
    currentList: string[],
    setList: (val: string[]) => void,
  ) => (
    <Flex wrap="wrap" gap={8} justify="center" style={{ width: "100%" }}>
      {interests?.map((interest) => {
        const isSelected = currentList.includes(interest.name);

        const style: React.CSSProperties = {
          borderRadius: "16px",
          padding: "4px 12px",
          border: `1px solid ${isSelected ? "transparent" : type === "like" ? "#d9f7be" : "#ffccc7"}`,
          backgroundColor: isSelected
            ? type === "like"
              ? "#52c41a"
              : "#f5222d"
            : "transparent",
          color: isSelected ? "#fff" : "inherit",
          transition: "all 0.3s",
        };

        return (
          <CheckableTag
            key={interest.id}
            checked={isSelected}
            onChange={() => handleToggle(interest.name, currentList, setList)}
            style={style}
          >
            {interest.name}
          </CheckableTag>
        );
      })}
    </Flex>
  );

  return (
    <Card
      title="Choose your interests"
      size="small"
      style={{ maxWidth: 600, margin: "0 auto" }}
    >
      <Form layout="vertical">
        <Form.Item
          label="What I like"
          labelCol={{ style: { width: "100%", textAlign: "center" } }}
        >
          {renderTags("like", likes, setLikes)}
        </Form.Item>

        <Divider />

        <Form.Item
          label="What I don't like"
          labelCol={{ style: { width: "100%", textAlign: "center" } }}
        >
          {renderTags("dislike", dislikes, setDislikes)}
        </Form.Item>
      </Form>
    </Card>
  );
}
