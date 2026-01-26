"use client";
import { Card, Typography, Collapse, Tag, Divider, Space } from "antd";
import { HeartOutlined, StopOutlined } from "@ant-design/icons";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

const { Text, Paragraph } = Typography;

export default function RevealPartner({ guest }: { guest: Guest }) {
  const { assignedRecipient } = guest;
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    setFormattedDate(
      new Date(guest.event.eventDate).toLocaleDateString("de-DE"),
    );
  }, [guest.event.eventDate]);

  if (!assignedRecipient) notFound();

  const collapseItems = [
    {
      key: "1",
      label: <Text>Dann klicke hier:</Text>,

      children: (
        <div className="space-y-4">
          <div>
            <Text className=" font-bold block mb-2 underline">
              <HeartOutlined className="mr-1" /> Mag ich:
            </Text>
            <Space wrap>
              {assignedRecipient.interests &&
              assignedRecipient.interests.length > 0
                ? assignedRecipient.interests.map(
                    (interest: InterestOption) => (
                      <Tag
                        color="green"
                        key={interest.id}
                        className="rounded-md"
                      >
                        {interest.name}
                      </Tag>
                    ),
                  )
                : "Keine Interessen angegeben"}
            </Space>
          </div>
          <div>
            <Text className=" font-bold block mb-2 underline">
              <StopOutlined className="mr-1" /> Lieber nicht:
            </Text>
            <Space wrap>
              {assignedRecipient.noInterest &&
              assignedRecipient.noInterest.length > 0
                ? assignedRecipient.noInterest.map(
                    (interest: InterestOption) => (
                      <Tag
                        color="error"
                        key={interest.id}
                        className="rounded-md"
                      >
                        {interest.name}
                      </Tag>
                    ),
                  )
                : "Keine Abneigungen angegeben"}
            </Space>
          </div>
        </div>
      ),
    },
  ];
  return (
    <Card
      className="max-w-md w-full shadow-2xl animate-in fade-in duration-700"
      title={
        <span className="text-red-600 font-bold uppercase tracking-widest flex justify-center">
          Dein Wichtel-Los
        </span>
      }
    >
      <div className="space-y-4">
        {/* Haupttext */}
        <Paragraph>
          Die Auslosung des Events <Text strong>{guest.event.name}</Text> wurde
          erfolgreich beendet. Das Event findet am{" "}
          <Text strong>{formattedDate}</Text> statt.
        </Paragraph>

        <Card>
          <Paragraph className="mb-0">
            Kaufe nun dein Geschenk für{" "}
            <Text strong>{assignedRecipient.name}</Text> im Wert von{" "}
            <Text strong>
              {guest.event.budget} {guest.event.currency}
            </Text>
            .
          </Paragraph>
          <div className="bg-slate-50 rounded-lg border-2 border-dashed border-gray-300 my-4 p-3">
            <div className="flex justify-center items-center mt-2">
              <Text
                type="secondary"
                className="text-sm justify-center flex mt-2"
              >
                Möchtest du mehr über die Interessen deines Wichtelpartners
                erfahren?
              </Text>
            </div>
            {/* Aufklappbare Interessen mit Ant Design Collapse */}
            <Collapse
              ghost
              expandIconPlacement="end"
              items={collapseItems}
              className="mt-4"
            />
          </div>
        </Card>

        <Divider className="my-2" />

        {assignedRecipient.noteForGiver && (
          <div className="mb-4">
            <Text type="secondary" className="uppercase font-bold text-[10px]">
              Persönliche Notiz für dich:
            </Text>
            <div className="p-3 bg-gray-50 rounded-lg border-l-4 mt-1">
              <Text italic>{assignedRecipient.noteForGiver}</Text>
            </div>
          </div>
        )}

        <Paragraph type="secondary" className="italic">
          Der Geschenkeaustausch wird offline organisiert. Viel Spaß beim
          Verschenken!
        </Paragraph>
      </div>
    </Card>
  );
}
