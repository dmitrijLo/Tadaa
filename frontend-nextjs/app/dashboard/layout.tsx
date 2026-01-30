"use client";
import {
  Breadcrumb,
  Button,
  Divider,
  Layout,
  Menu,
  MenuProps,
  Spin,
  theme,
} from "antd";
import { PropsWithChildren, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  GiftOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useSidebarStore } from "@/stores/useSidebarStore";
import { useAuthStore } from "@/stores/useAuthStore";

const { Content, Sider } = Layout;

const showSidebar = true;

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "1",
    icon: <HomeOutlined />,
    label: <Link href="/">Home</Link>,
  },
  {
    key: "2",
    icon: <PieChartOutlined />,
    label: <Link href="/dashboard">Dashboard</Link>,
  },
  {
    key: "sub1",
    label: "Events",
    icon: <GiftOutlined />,
    children: [
      {
        key: "4",
        label: <Link href="/dashboard/events/create">Neues Event</Link>,
      },
    ],
  },
];

export default function DashboardPageLayout({ children }: PropsWithChildren) {
  const { token } = theme.useToken();
  const pathname = usePathname();
  const router = useRouter();
  const { collapsed, toggleCollapsed } = useSidebarStore();
  const { hasHydrated, currentUser } = useAuthStore();

  const breadcrumbItems = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);

    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join("/")}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);

      return {
        title:
          index === segments.length - 1 ? (
            label
          ) : (
            <Link href={path}>{label}</Link>
          ),
      };
    });
  }, [pathname]);

  useEffect(() => {
    if (hasHydrated && !currentUser) {
      router.push("/login");
    }
  }, [hasHydrated, currentUser, router]);

  if (!hasHydrated || !currentUser) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      {showSidebar && (
        <Sider
          width={"auto"}
          style={{
            background: "white",
            borderRadius: token.borderRadiusLG,
            padding: 24,
          }}
        >
          <div>
            <Menu
              defaultSelectedKeys={["2"]}
              //defaultOpenKeys={["sub1"]}
              className={"sidebarMenu"}
              mode="inline"
              theme="light"
              inlineCollapsed={collapsed}
              items={items}
            />
          </div>
        </Sider>
      )}
      <Layout className={"contentContainer"}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: token.colorBgContainer,
            borderRadius: token.borderRadiusLG,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
            }}
          >
            {showSidebar && (
              <Button
                color="primary"
                variant="outlined"
                size="large"
                onClick={toggleCollapsed}
              >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </Button>
            )}
            <Breadcrumb items={breadcrumbItems} style={{ margin: "0 0 0 0" }} />
          </div>
          <Divider />
          {children}
        </Content>
      </Layout>
    </>
  );
}
