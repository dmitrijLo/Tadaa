"use client";

import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  InputNumberProps,
  App,
} from "antd";
import locale from "antd/locale/de_DE";
import dayjs from "dayjs";
import { Controller, useWatch, useForm } from "react-hook-form";
import {
  InfoCircleOutlined,
  GiftOutlined,
  DeleteOutlined,
  EditOutlined,
  SwapOutlined,
  LinkOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";
import { ModeSelector } from "@/components";
import type { ModeOption } from "@/components/event/ModeSelector";
import { eventModeByModusMock, eventModesMock } from "@/constants/modes";
import { drawRuleByRuleMock, drawRulesMock } from "@/constants/drawRules";
import { EventMode, DrawRule } from "@/types/enums";
import { useMemo, useState, useEffect } from "react";

const formatter: InputNumberProps<number>["formatter"] = (value) => {
  const [start, end] = `${value}`.split(".") || [];
  const v = `${start}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${end ? `${v},${end}` : `${v}`}`;
};

const parser: InputNumberProps<number>["parser"] = (value) => {
  return value?.replace(/\./g, "").replace(/,/g, ".") as unknown as number;
};

// Helper functions for date/time validation
const getEventDateDisabledDate = (current: dayjs.Dayjs | null): boolean => {
  if (!current) return false;
  return current.isBefore(dayjs(), "day");
};

const getEventDateDisabledTime = (current: dayjs.Dayjs | null) => {
  if (!current || !current.isSame(dayjs(), "day")) return {};
  const now = dayjs();
  return {
    disabledHours: () => Array.from({ length: now.hour() }, (_, i) => i),
    disabledMinutes: (selectedHour: number) => {
      if (selectedHour === now.hour()) {
        return Array.from({ length: now.minute() + 1 }, (_, i) => i);
      }
      return [];
    },
  };
};

const getInvitationDateDisabledDate = (
  current: dayjs.Dayjs | null,
  eventDate: Date | null,
): boolean => {
  if (!current) return false;
  const now = dayjs();
  const eventEnd = eventDate ? dayjs(eventDate) : null;
  return (
    current.isBefore(now, "day") ||
    (eventEnd ? current.isAfter(eventEnd, "day") : false)
  );
};

const getInvitationDateDisabledTime = (
  current: dayjs.Dayjs | null,
  eventDate: Date | null,
) => {
  if (!current) return {};
  const now = dayjs();
  const eventEnd = eventDate ? dayjs(eventDate) : null;

  // block times before now on current day
  if (current.isSame(now, "day")) {
    return {
      disabledHours: () => Array.from({ length: now.hour() }, (_, i) => i),
      disabledMinutes: (selectedHour: number) => {
        if (selectedHour === now.hour()) {
          return Array.from({ length: now.minute() + 1 }, (_, i) => i);
        }
        return [];
      },
    };
  }

  // block times after event on event day
  if (eventEnd && current.isSame(eventEnd, "day")) {
    return {
      disabledHours: () =>
        Array.from({ length: 24 }, (_, i) => i).filter(
          (h) => h >= eventEnd.hour(),
        ),
      disabledMinutes: (selectedHour: number) => {
        if (selectedHour === eventEnd.hour()) {
          return Array.from({ length: 60 }, (_, i) => i).filter(
            (m) => m >= eventEnd.minute(),
          );
        }
        return [];
      },
    };
  }

  return {};
};

const getDraftDateDisabledDate = (
  current: dayjs.Dayjs | null,
  invitationDate: Date | null,
  eventDate: Date | null,
): boolean => {
  if (!current) return false;
  const invitationStart = invitationDate ? dayjs(invitationDate) : null;
  const eventEnd = eventDate ? dayjs(eventDate) : null;
  return (
    (invitationStart ? current.isBefore(invitationStart, "day") : false) ||
    (eventEnd ? current.isAfter(eventEnd, "day") : false)
  );
};

const getDraftDateDisabledTime = (
  current: dayjs.Dayjs | null,
  invitationDate: Date | null,
  eventDate: Date | null,
) => {
  if (!current) return {};
  const invitationStart = invitationDate ? dayjs(invitationDate) : null;
  const eventEnd = eventDate ? dayjs(eventDate) : null;

  // block times before invitation on invitation day
  if (invitationStart && current.isSame(invitationStart, "day")) {
    return {
      disabledHours: () =>
        Array.from({ length: invitationStart.hour() }, (_, i) => i),
      disabledMinutes: (selectedHour: number) => {
        if (selectedHour === invitationStart.hour()) {
          return Array.from(
            { length: invitationStart.minute() + 1 },
            (_, i) => i,
          );
        }
        return [];
      },
    };
  }

  // block times after event on event day
  if (eventEnd && current.isSame(eventEnd, "day")) {
    return {
      disabledHours: () =>
        Array.from({ length: 24 }, (_, i) => i).filter(
          (h) => h >= eventEnd.hour(),
        ),
      disabledMinutes: (selectedHour: number) => {
        if (selectedHour === eventEnd.hour()) {
          return Array.from({ length: 60 }, (_, i) => i).filter(
            (m) => m >= eventEnd.minute(),
          );
        }
        return [];
      },
    };
  }

  return {};
};

type FormData = CreateEventDto;

interface EventSettingsProps {
  onSubmit: (data: CreateEventDto) => Promise<void>;
  initialData?: CreateEventDto | null;
  submitLabel?: string;
}

export default function EventSettings({
  onSubmit,
  initialData,
  submitLabel = "Weiter",
}: EventSettingsProps) {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
  } = useForm<FormData>({
    defaultValues: initialData || {
      name: "",
      description: "",
      budget: 0,
      eventMode: EventMode.CLASSIC,
      drawRule: DrawRule.EXCHANGE,
    },
  });

  const eventDate = useWatch({ control, name: "eventDate" });
  const invitationDate = useWatch({ control, name: "invitationDate" });
  const draftDate = useWatch({ control, name: "draftDate" });

  // Clear invitationDate if eventDate becomes earlier than invitationDate
  useEffect(() => {
    if (
      eventDate &&
      invitationDate &&
      dayjs(eventDate).isBefore(invitationDate)
    ) {
      setValue("invitationDate", undefined as unknown as Date);
    }
  }, [eventDate, invitationDate, setValue]);

  // Clear draftDate if it becomes invalid
  useEffect(() => {
    if (draftDate) {
      // Clear if draftDate is before invitationDate
      if (invitationDate && dayjs(draftDate).isBefore(invitationDate)) {
        setValue("draftDate", undefined as unknown as Date);
      }
      // Clear if draftDate is after or equal to eventDate
      else if (
        eventDate &&
        (dayjs(draftDate).isAfter(eventDate) ||
          dayjs(draftDate).isSame(eventDate))
      ) {
        setValue("draftDate", undefined as unknown as Date);
      }
    }
  }, [eventDate, invitationDate, draftDate, setValue]);

  const modeIcons: Record<EventMode, React.ReactNode> = useMemo(
    () => ({
      [EventMode.CLASSIC]: <GiftOutlined />,
      [EventMode.SCRAP]: <DeleteOutlined />,
      [EventMode.CUSTOM]: <EditOutlined />,
    }),
    [],
  );

  const ruleIcons: Record<DrawRule, React.ReactNode> = useMemo(
    () => ({
      [DrawRule.EXCHANGE]: <SwapOutlined />,
      [DrawRule.CHAIN]: <LinkOutlined />,
      [DrawRule.PICK_ORDER]: <OrderedListOutlined />,
    }),
    [],
  );

  const modeOptions: ModeOption<EventMode>[] = useMemo(
    () =>
      eventModesMock.map((mode) => ({
        label: mode.name,
        value: mode.mode,
        icon: modeIcons[mode.mode],
      })),
    [modeIcons],
  );

  const drawRuleOptions: ModeOption<DrawRule>[] = useMemo(
    () =>
      drawRulesMock.map((rule) => ({
        label: rule.name,
        value: rule.mode,
        icon: ruleIcons[rule.mode],
      })),
    [ruleIcons],
  );

  const handleFormSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await onSubmit(data);
    } catch (error) {
      console.error("Fehler beim Speichern des Events:", error);
      message.error("Event konnte nicht gespeichert werden");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(handleFormSubmit)}>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ flex: "10 1 200px" }}>
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
                  size="large"
                />
              )}
            />
          </Form.Item>
        </div>
        <div style={{ flex: "1 1 100px" }}>
          <Form.Item
            label="Budget"
            validateStatus={errors.budget ? "error" : ""}
            help={errors.budget?.message}
          >
            <Controller
              name="budget"
              control={control}
              rules={{
                required: "Bitte Budget eingeben",
                min: {
                  value: 0,
                  message: "Budget muss mindestens 0 sein",
                },
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
                  size="large"
                />
              )}
            />
          </Form.Item>
        </div>
      </div>

      <Form.Item label="Beschreibung">
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Optional: Beschreibung des Events"
              size="large"
            />
          )}
        />
      </Form.Item>
      <Divider />
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px" }}>
          <Form.Item
            label="Event-Datum"
            required
            validateStatus={errors.eventDate ? "error" : ""}
            help={errors.eventDate?.message}
            tooltip={{
              title: "Wann findet das Event statt?",
              icon: <InfoCircleOutlined />,
            }}
          >
            <Controller
              name="eventDate"
              control={control}
              rules={{
                required: "Bitte Event-Datum auswählen",
              }}
              render={({ field }) => (
                <DatePicker
                  showTime={{ format: "HH:mm" }}
                  format="DD.MM.YYYY HH:mm"
                  locale={locale.DatePicker}
                  disabledDate={getEventDateDisabledDate}
                  disabledTime={getEventDateDisabledTime}
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date?.toDate() || null)}
                  style={{ width: "100%" }}
                  size="large"
                  status={errors.eventDate ? "error" : ""}
                />
              )}
            />
          </Form.Item>
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <Form.Item
            label="Einladung versenden"
            required
            validateStatus={errors.invitationDate ? "error" : ""}
            help={errors.invitationDate?.message}
            tooltip={{
              title:
                "Wann sollen die Einladungen an die Teilnehmer versendet werden?",
              icon: <InfoCircleOutlined />,
            }}
          >
            <Controller
              name="invitationDate"
              control={control}
              rules={{
                required: "Bitte Einladungs-Datum auswählen",
              }}
              render={({ field }) => (
                <DatePicker
                  showTime={{ format: "HH:mm" }}
                  style={{ width: "100%" }}
                  format="DD.MM.YYYY HH:mm"
                  locale={locale.DatePicker}
                  disabledDate={(current) =>
                    getInvitationDateDisabledDate(current, eventDate)
                  }
                  disabledTime={(current) =>
                    getInvitationDateDisabledTime(current, eventDate)
                  }
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date?.toDate() || null)}
                  disabled={!eventDate}
                  size="large"
                  status={errors.invitationDate ? "error" : ""}
                />
              )}
            />
          </Form.Item>
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <Form.Item
            label="Auslosung"
            required
            validateStatus={errors.draftDate ? "error" : ""}
            help={errors.draftDate?.message}
            tooltip={{
              title: "Wann soll die Auslosung der Wichtel-Partner stattfinden?",
              icon: <InfoCircleOutlined />,
            }}
          >
            <Controller
              name="draftDate"
              control={control}
              rules={{
                required: "Bitte Auslosungs-Datum auswählen",
              }}
              render={({ field }) => (
                <DatePicker
                  showTime={{ format: "HH:mm" }}
                  style={{ width: "100%" }}
                  format="DD.MM.YYYY HH:mm"
                  locale={locale.DatePicker}
                  disabledDate={(current) =>
                    getDraftDateDisabledDate(current, invitationDate, eventDate)
                  }
                  disabledTime={(current) =>
                    getDraftDateDisabledTime(current, invitationDate, eventDate)
                  }
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date?.toDate() || null)}
                  disabled={!invitationDate}
                  size="large"
                  status={errors.draftDate ? "error" : ""}
                />
              )}
            />
          </Form.Item>
        </div>
      </div>
      <Divider />
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px" }}>
          <Form.Item label="Modus auswählen">
            <Controller
              name="eventMode"
              control={control}
              render={({ field }) => (
                <ModeSelector
                  options={modeOptions}
                  modeData={eventModeByModusMock}
                  defaultValue={field.value}
                  collapseLabel="Funktionsweise des Modus"
                  onModeChange={field.onChange}
                />
              )}
            />
          </Form.Item>
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <Form.Item label="Auslosungsregel">
            <Controller
              name="drawRule"
              control={control}
              render={({ field }) => (
                <ModeSelector
                  options={drawRuleOptions}
                  modeData={drawRuleByRuleMock}
                  defaultValue={field.value}
                  collapseLabel="Funktionsweise der Regel"
                  onModeChange={field.onChange}
                />
              )}
            />
          </Form.Item>
        </div>
      </div>

      <Form.Item>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            variant="outlined"
            disabled={!!initialData && !isDirty}
          >
            {submitLabel}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}
