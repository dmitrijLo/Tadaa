import { EventStatus, EventMode } from "@/types/enums";
import {
  BugOutlined,
  CalendarOutlined,
  ExperimentOutlined,
  StarOutlined,
} from "@ant-design/icons";

export const getEventModeConfig = (mode: string) => {
  switch (mode) {
    case EventMode.CLASSIC:
      return { icon: <StarOutlined />, color: "blue", label: "Classic" };
    case EventMode.SCRAP:
      return { icon: <BugOutlined />, color: "orange", label: "Scrap" };
    case EventMode.CUSTOM:
      return { icon: <ExperimentOutlined />, color: "purple", label: "Custom" };
    default:
      return { icon: <CalendarOutlined />, color: "default", label: mode };
  }
};

export const getEventStatusColor = (status: string) => {
  switch (status) {
    case EventStatus.DRAFT:
      return "orange";
    case EventStatus.CREATED:
      return "";
    case EventStatus.INVITED:
      return "geekblue";
    case EventStatus.ASSIGNED:
      return "green";
    case EventStatus.DONE:
      return "purple";
    default:
      return "default";
  }
};
