"use client";
import { Button, Carousel, Spin, Tag, Typography } from "antd";
import { BulbOutlined, GiftOutlined } from "@ant-design/icons";
import { useInterestStore } from "@/stores/useInterestStore";

const { Text, Paragraph } = Typography;

interface GiftSuggestionsProps {
  recipientId: string;
}

export default function GiftSuggestions({ recipientId }: GiftSuggestionsProps) {
  const { suggestions, isSuggestionsLoading, getSuggestions } =
    useInterestStore();

  const handleGetSuggestions = () => {
    getSuggestions(recipientId);
  };

  if (suggestions.length === 0 && !isSuggestionsLoading) {
    return (
      <Button
        type="dashed"
        icon={<BulbOutlined />}
        onClick={handleGetSuggestions}
        className="w-full"
      >
        KI-Geschenkvorschläge anzeigen
      </Button>
    );
  }

  if (isSuggestionsLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spin tip="Lade Vorschläge..." />
      </div>
    );
  }

  return (
    <div>
      <Text className="font-bold block mb-2">
        <GiftOutlined className="mr-1" /> KI-Geschenkvorschläge:
      </Text>
      <div className="carousel-wrapper">
        <Carousel
          dots={{ className: "custom-dots" }}
          autoplay={false}
          infinite={true}
        >
          {suggestions.map((suggestion, index) => (
            <div key={index}>
              <div className="px-1">
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 min-h-[130px]">
                  <div className="flex justify-between items-start mb-2">
                    <Tag variant="outlined" color="blue" className="text-xs">
                      {suggestion.category}
                    </Tag>
                    <Text strong className="text-green-600 text-sm">
                      {suggestion.estimatedPrice}
                    </Text>
                  </div>
                  <Text strong className="block mb-1">
                    {suggestion.name}
                  </Text>
                  <Paragraph
                    type="secondary"
                    className="text-xs mb-0"
                    ellipsis={{ rows: 2 }}
                  >
                    {suggestion.description}
                  </Paragraph>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
