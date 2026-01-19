import { Card, Divider, Form, Tag, Flex, Spin } from "antd";
import React from "react";
import { useInterestStore } from "@/stores/useInterestStore";
const { CheckableTag } = Tag;

export default function InterestPicker({
  interests: interestOptions,
  guestId,
  isLoading,
}: {
  interests: { name: string; id: string }[] | undefined;
  guestId: string;
  isLoading: boolean;
}) {
  const { interests, noInterest, addInterest, removeInterest } =
    useInterestStore();

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
      title="Choose your interests"
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
