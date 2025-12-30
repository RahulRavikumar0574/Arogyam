import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DoctorShell from "@/components/DoctorShell";

export default async function DoctorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || role !== "DOCTOR") {
    redirect("/doctor-login");
  }
  return <DoctorShell>{children}</DoctorShell>;
}
