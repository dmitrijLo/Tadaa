"use client";

import { Breadcrumb } from "antd";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useBreadcrumbStore } from "@/stores/useBreadcrumbStore";

export default function DashboardBreadcrumb() {
  const pathname = usePathname();
  const { overrides } = useBreadcrumbStore();

  const breadcrumbItems = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);

    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join("/")}`;
      const isUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          segment,
        );

      const label =
        overrides[path] ||
        (isUUID
          ? "Details"
          : segment.charAt(0).toUpperCase() + segment.slice(1));

      return {
        title:
          index === segments.length - 1 ? (
            label
          ) : (
            <Link href={path}>{label}</Link>
          ),
      };
    });
  }, [pathname, overrides]);

  return <Breadcrumb items={breadcrumbItems} style={{ margin: "0 0 0 0" }} />;
}
