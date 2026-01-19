"use client";

import { ModeSelector } from "@/components";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  InputNumberProps,
  Select,
  message,
} from "antd";
import locale from "antd/locale/de_DE";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import { DrawRule, EventMode } from "@/enums/enums";
import { CreateEventDto } from "@/types/guest";
import { useForm, Controller } from "react-hook-form";
import AddEventGuests from "@/components/event/AddEventGuests";

const formatter: InputNumberProps<number>["formatter"] = (value) => {
  const [start, end] = `${value}`.split(".") || [];
  const v = `${start}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${end ? `${v},${end}` : `${v}`}`;
};

const parser: InputNumberProps<number>["parser"] = (value) => {
  return value?.replace(/\./g, "").replace(/,/g, ".") as unknown as number;
};

type EventFormProps = {
  createEvent: (formData: CreateEventDto) => Promise<void>;
};

type FormData = Omit<
  CreateEventDto,
  "eventMode" | "eventDate" | "invitationDate" | "draftDate"
>;

export default function EventForm({ createEvent }: EventFormProps) {
  const [eventDate, setEventDate] = useState<Dayjs | null>(null);
  const [invitationDate, setInvitationDate] = useState<Dayjs | null>(null);
  const [draftDate, setDraftDate] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<EventMode>(
    EventMode.CLASSIC,
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      description: "",
      budget: 0,
      drawRule: DrawRule.EXCHANGE,
    },
  });

  const onSubmit = async (values: FormData) => {
    try {
      setLoading(true);
      await createEvent({
        name: values.name,
        description: values.description || "",
        budget: values.budget,
        eventMode: selectedMode,
        drawRule: values.drawRule,
        eventDate: eventDate?.toISOString() || "",
        invitationDate: invitationDate?.toISOString() || "",
        draftDate: draftDate?.toISOString() || "",
      });
      message.success("Event erfolgreich erstellt!");
    } catch (error) {
      console.error("Fehler beim Erstellen des Events:", error);
      message.error("Event konnte nicht erstellt werden.");
      setLoading(false);
    }
  };

  return (
    <Card style={{ width: 800 }}>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          label="Event-Name"
          required
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            rules={{ required: "Bitte Event-Namen eingeben" }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder={`z.B. Wichteln ${new Date().getFullYear()}`}
              />
            )}
          />
        </Form.Item>

        <Form.Item label="Beschreibung">
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Optional: Beschreibung des Events"
              />
            )}
          />
        </Form.Item>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 200px" }}>
            <Form.Item
              label="Event-Datum"
              required
              tooltip={{
                title: "Wann findet das Event statt?",
                icon: <InfoCircleOutlined />,
              }}
            >
              <DatePicker
                showTime={{ format: "HH:mm" }}
                format="DD.MM.YYYY HH:mm"
                locale={locale.DatePicker}
                minDate={dayjs()}
                value={eventDate}
                onChange={setEventDate}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </div>
          <div style={{ flex: "1 1 200px" }}>
            <Form.Item
              label="Einladung versenden"
              required
              tooltip={{
                title:
                  "Wann sollen die Einladungen an die Teilnehmer versendet werden?",
                icon: <InfoCircleOutlined />,
              }}
            >
              <DatePicker
                showTime={{ format: "HH:mm" }}
                style={{ width: "100%" }}
                format="DD.MM.YYYY HH:mm"
                locale={locale.DatePicker}
                minDate={dayjs()}
                maxDate={eventDate || undefined}
                value={invitationDate}
                onChange={setInvitationDate}
                disabled={!eventDate}
              />
            </Form.Item>
          </div>
          <div style={{ flex: "1 1 200px" }}>
            <Form.Item
              label="Auslosung"
              required
              tooltip={{
                title:
                  "Wann soll die Auslosung der Wichtel-Partner stattfinden?",
                icon: <InfoCircleOutlined />,
              }}
            >
              <DatePicker
                showTime={{ format: "HH:mm" }}
                style={{ width: "100%" }}
                format="DD.MM.YYYY HH:mm"
                locale={locale.DatePicker}
                minDate={invitationDate || undefined}
                maxDate={eventDate || undefined}
                value={draftDate}
                onChange={setDraftDate}
                disabled={!invitationDate}
              />
            </Form.Item>
          </div>
        </div>

        <Form.Item label="Modus auswählen" required>
          <ModeSelector onModeChange={setSelectedMode} />
        </Form.Item>

        <Form.Item
          label="Auslosungsregel"
          required
          validateStatus={errors.drawRule ? "error" : ""}
          help={errors.drawRule?.message}
        >
          <Controller
            name="drawRule"
            control={control}
            rules={{ required: "Bitte Auslosungsregel auswählen" }}
            render={({ field }) => (
              <Select
                {...field}
                style={{ width: "100%" }}
                options={[
                  {
                    value: DrawRule.EXCHANGE,
                    label: "Austausch",
                  },
                  { value: DrawRule.CHAIN, label: "Kette" },
                  {
                    value: DrawRule.PICK_ORDER,
                    label: "Reihenfolge",
                  },
                ]}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Budget"
          required
          validateStatus={errors.budget ? "error" : ""}
          help={errors.budget?.message}
        >
          <Controller
            name="budget"
            control={control}
            rules={{
              required: "Bitte Budget eingeben",
              min: { value: 0, message: "Budget muss mindestens 0 sein" },
            }}
            render={({ field }) => (
              <InputNumber
                {...field}
                suffix="€"
                style={{ width: "100%" }}
                formatter={formatter}
                parser={parser}
                precision={2}
                min={0}
                placeholder="0,00"
              />
            )}
          />
        </Form.Item>

        <Form.Item label="Gäste hinzufügen">
          <Card>
            <AddEventGuests />
          </Card>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
          >
            Erstellen
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
