import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { PageHeader } from "@/components/ui";
import { PhonebookList } from "./PhonebookList";

export const metadata = { title: "ספר טלפונים" };

export default async function Phonebook() {
  await requireUser();
  const users = await db.user.findMany({ include: { team: true }, orderBy: { name: "asc" } });
  const people = users.map((u) => ({
    id: u.id,
    name: u.name,
    jobTitle: u.jobTitle ?? "",
    team: u.role === "MANAGER" ? "הנהלה" : (u.team?.name ?? ""),
    email: u.email,
    mobile: u.hideMobile ? null : u.mobile,
    color: u.avatarColor,
  }));
  return (
    <>
      <PageHeader title="ספר טלפונים" subtitle={`${people.length} אנשי קשר`} />
      <PhonebookList people={people} />
    </>
  );
}
