"use client";
import { Card, Typography, Collapse, Tag, Divider, Space } from "antd";
import { HeartOutlined, StopOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

export default function RevealPartner({ data }: { data: any }) {
  const collapseItems = [
    {
      key: "1",
      label: <Text>Dann klicke hier:</Text>,

      children: (
        <div className="space-y-4">
          <div>
            <Text className="text-green-600 font-bold block mb-2 underline">
              <HeartOutlined className="mr-1" /> Mag ich:
            </Text>
            <Space wrap>
              {data.receiver.interests.likes.map((item: string) => (
                <Tag color="green" key={item} className="rounded-md">
                  {item}
                </Tag>
              ))}
            </Space>
          </div>
          <div>
            <Text className="text-red-600 font-bold block mb-2 underline">
              <StopOutlined className="mr-1" /> Lieber nicht:
            </Text>
            <Space wrap>
              {data.receiver.interests.dislikes.map((item: string) => (
                <Tag color="error" key={item} className="rounded-md">
                  {item}
                </Tag>
              ))}
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
          Die Auslosung des Events <Text strong>{data.event.name}</Text> wurde
          erfolgreich beendet. Das Event findet am{" "}
          <Text strong>{data.event.eventDate}</Text> statt.
        </Paragraph>

        <Card>
          <Paragraph className="mb-0">
            Kaufe nun dein Geschenk für <Text strong>{data.receiver.name}</Text>{" "}
            im Wert von{" "}
            <Text strong>
              {data.event.budget} {data.event.currency}
            </Text>
            .
          </Paragraph>
          <div className="bg-slate-50 rounded-lg border-2 border-dashed border-gray-300 my-4 p-3">
            <div className="flex justify-center items-center mt-2">
              {" "}
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

        {/* Notiz des Empfängers */}
        {data.receiver.noteForGiver && (
          <div className="mb-4">
            <Text type="secondary" className="uppercase font-bold text-[10px]">
              Persönliche Notiz für dich:
            </Text>
            <div className="p-3 bg-gray-50 rounded-lg border-l-4 mt-1">
              <Text italic>"{data.receiver.noteForGiver}"</Text>
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
