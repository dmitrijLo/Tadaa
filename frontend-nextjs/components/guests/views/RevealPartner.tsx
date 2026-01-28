"use client";
import { Card, Typography, Collapse, Tag, Divider, Space } from "antd";
import { HeartOutlined, StopOutlined } from "@ant-design/icons";
import { notFound } from "next/navigation";
import GiftSuggestions from "../interests/GiftSuggestions";
import { useEffect, useState } from "react";
import { DrawRule } from "@/types/enums";

const { Text, Paragraph } = Typography;

export default function RevealPartner({ guest }: { guest: Guest }) {
  const { assignedRecipient, pickOrder } = guest;
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    setFormattedDate(
      new Date(guest.event.eventDate).toLocaleDateString("de-DE"),
    );
  }, [guest.event.eventDate]);

  const introParagraph = (
    <Paragraph>
      Die Auslosung des Events <Text strong>{guest.event.name}</Text> wurde
      erfolgreich beendet. Das Event findet am{" "}
      <Text strong>{formattedDate}</Text> statt. Kaufe nun dein Geschenk im Wert
      von{" "}
      <Text strong>
        {guest.event.budget} {guest.event.currency}{" "}
      </Text>
      .
    </Paragraph>
  );

  const outroParagraph = (
    <Paragraph type="secondary" className="italic">
      Der Geschenkeaustausch wird offline organisiert. Viel Spaß beim
      Verschenken!
    </Paragraph>
  );

  // If pick order is used, show pick order view
  if (guest.event.drawRule === DrawRule.PICK_ORDER) {
    const sortedGuests = guest.event.guests
      ? [...guest.event.guests].sort(
          (a, b) => (a.pickOrder ?? 0) - (b.pickOrder ?? 0),
        )
      : [];

    return (
      <Card
        className="max-w-md w-full shadow-2xl animate-in fade-in duration-700"
        title={
          <span
            className="font-bold uppercase flex justify-center"
            style={{
              background: "var(--gradientPrimary)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent", 
            }}
          >
            Deine Wichtel-Reihenfolge
          </span>
        }
      >
        <div className="space-y-4">
          {introParagraph}

          <Card>
            <Paragraph className="mb-0">
              Du bist an Position <Text strong>{pickOrder}</Text>.
            </Paragraph>
            <Paragraph type="secondary" className="text-sm">
              Die Geschenke werden nacheinander gewählt. Wenn du dran bist,
              suchst du dir eins aus.
            </Paragraph>{" "}
            <Divider className="my-2" />
            <Text strong className="block mb-3">
              Alle Teilnehmer:
            </Text>
            {sortedGuests.map((g, index) => {
              const isCurrentGuest = g.id === guest.id;
              return (
                <div
                  key={g.id}
                  className="flex items-center p-3 rounded-lg border mb-2"
                  style={
                    isCurrentGuest
                      ? {
                          backgroundImage:
                            "linear-gradient(white, white), var(--gradientPrimary)",
                          backgroundOrigin: "border-box",
                          backgroundClip: "padding-box, border-box",
                          border: "2px solid transparent",
                        }
                      : {
                          border: "1px solid #f0f0f0",
                        }
                  }
                >
                  <span
                    className="flex items-center justify-center w-7 h-7 rounded-full mr-3 text-xs font-bold"
                    style={{
                      background: isCurrentGuest
                        ? "var(--gradientPrimary)"
                        : "#f3f4f6",
                      color: isCurrentGuest ? "#ffffff" : "black",
                    }}
                  >
                    {index + 1}.
                  </span>
                  <Text strong={isCurrentGuest}>{g.name}</Text>
                  {isCurrentGuest && (
                    <Text italic className="ml-auto text-gray-400 text-xs">
                      (Du)
                    </Text>
                  )}
                </div>
              );
            })}
          </Card>
          {outroParagraph}
        </div>
      </Card>
    );
  }

  if (!assignedRecipient) notFound();

  // Standard view showing assigned recipient details, when chain or exchange
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
                : "keine Interessen angegeben"}
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
                : "kein No-Go angegeben"}
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
        <span
          className="font-bold uppercase flex justify-center"
          style={{
            background: "var(--gradientPrimary)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent", 
          }}
        >
          Dein Wichtel-Los
        </span>
      }
    >
      <div className="space-y-4">
        {introParagraph}

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

          {/* AI Gift Suggestions */}
          <div className="mt-4">
            <GiftSuggestions recipientId={assignedRecipient.id} />
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

        {outroParagraph}
      </div>
    </Card>
  );
}
