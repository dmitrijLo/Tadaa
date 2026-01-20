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
    currentList: string[],
    type: "like" | "dislike",
  ) => {
    const like = type === "like";
    if (currentList.includes(interestId)) {
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

  const renderTags = (type: "like" | "dislike", currentList: string[]) => (
    <Flex wrap="wrap" gap={8} justify="center" style={{ width: "100%" }}>
      {interestOptions?.map((interest) => {
        const isSelected = currentList.includes(interest.id);

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
          <span>Choose your interests</span>
          <Flex gap={8}>
            <Input
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onPressEnter={handleAddInterest}
              placeholder="Add an option"
              style={{ width: "200px" }}
            />
            <Button onClick={handleAddInterest}>Add</Button>
          </Flex>
        </Flex>
      }
      size="small"
      style={{ maxWidth: 600, margin: "0 auto" }}
    >
      <Spin spinning={isLoading} tip="Loading interests...">
        <Form layout="vertical">
          <Form.Item
            label="What I like"
            labelCol={{ style: { width: "100%", textAlign: "center" } }}
          >
            {renderTags("like", interests)}
          </Form.Item>

          <Divider />

          <Form.Item
            label="What I don't like"
            labelCol={{ style: { width: "100%", textAlign: "center" } }}
          >
            {renderTags("dislike", noInterest)}
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
}
