import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard | HireMind",
};

export default async function DashboardPage() {
  redirect("/overview");
}
