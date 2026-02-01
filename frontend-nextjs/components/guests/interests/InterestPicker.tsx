import React, { useState } from "react";
import { Card, Divider, Form, Tag, Flex, Spin, Input, Button } from "antd";
import { useInterestStore } from "@/stores/useInterestStore";
const { CheckableTag } = Tag;

export default function InterestPicker({
  guestId,
  isLoading,
}: {
  guestId: string;
  isLoading: boolean;
}) {
  const {
    interestOptions,
    interests,
    noInterest,
    addInterest,
    removeInterest,
    addInterestOption,
  } = useInterestStore();

  const [newInterest, setNewInterest] = useState("");

  const handleToggle = async (
    interestId: string,
    currentList: InterestOption[],
    type: "like" | "dislike",
  ) => {
    const like = type === "like";
    if (currentList.some((i) => i.id === interestId)) {
      await removeInterest(guestId, interestId, like);
    } else {
      await addInterest(guestId, interestId, like);
    }
  };

  const handleAddInterest = async () => {
    if (newInterest.trim() !== "") {
      await addInterestOption(newInterest);
      setNewInterest("");
    }
  };

  const renderTags = (
    type: "like" | "dislike",
    currentList: InterestOption[],
  ) => (
    <Flex wrap="wrap" gap={8} justify="center" style={{ width: "100%" }}>
      {interestOptions?.map((interest) => {
        const isSelected = currentList.some((i) => i.id === interest.id);

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
            onChange={() => handleToggle(interest.id, currentList, type)}
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
      title={
        <Flex align="center" justify="space-between" wrap="wrap" gap={8}>
          <span>Wähle hier deine Interessen aus:</span>
          <Flex gap={8}>
            <Input
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onPressEnter={handleAddInterest}
              placeholder="Option hinzufügen"
              style={{ width: "200px" }}
            />
            <Button onClick={handleAddInterest}>Hinzufügen</Button>
          </Flex>
        </Flex>
      }
      size="small"
      style={{ maxWidth: 600, margin: "0 auto" }}
    >
      <Spin spinning={isLoading} tip="Interessen werden geladen...">
        <Form layout="vertical">
          <Form.Item
            label="Was ich mag"
            labelCol={{ style: { width: "100%", textAlign: "center" } }}
          >
            {renderTags("like", interests)}
          </Form.Item>

          <Divider />

          <Form.Item
            label="Was ich nicht mag"
            labelCol={{ style: { width: "100%", textAlign: "center" } }}
          >
            {renderTags("dislike", noInterest)}
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
}
