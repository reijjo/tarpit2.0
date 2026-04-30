import { getMe } from "@/lib/auth/getMe";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await getMe();

  console.log("AppLayout - getMe response:", me);

  if (!me.success) {
    return redirect("/login");
  }

  return <main>{children}</main>;
}
