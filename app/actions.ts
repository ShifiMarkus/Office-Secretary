"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { endSession, requireManager, requireUser, startSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/config";
import { todayIL } from "@/lib/dates";

export async function demoLogin(formData: FormData) {
  if (!isDemoMode) throw new Error("כניסת הדגמה זמינה רק במצב הדגמה");
  const id = String(formData.get("userId") ?? "");
  const user = await db.user.findUnique({ where: { id } });
  if (!user) redirect("/login");
  await startSession(user.id);
  redirect("/");
}

export async function logout() {
  await endSession();
  redirect("/login");
}

export async function sendWish(formData: FormData) {
  const me = await requireUser();
  const toId = String(formData.get("toId") ?? "");
  const message = String(formData.get("message") ?? "").trim().slice(0, 500);
  if (!toId || !message || toId === me.id) return;
  const year = todayIL().getUTCFullYear();
  const existing = await db.birthdayWish.findFirst({ where: { toId, fromId: me.id, year } });
  if (existing) {
    await db.birthdayWish.update({ where: { id: existing.id }, data: { message } });
  } else {
    await db.birthdayWish.create({ data: { toId, fromId: me.id, message, year } });
  }
  revalidatePath("/");
  revalidatePath("/birthdays");
}

export async function markRead(announcementId: string) {
  const me = await requireUser();
  await db.announcementRead.upsert({
    where: { announcementId_userId: { announcementId, userId: me.id } },
    create: { announcementId, userId: me.id },
    update: {},
  });
  revalidatePath("/");
  revalidatePath("/announcements");
}

export async function createAnnouncement(formData: FormData) {
  const me = await requireManager();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!title || !body) return;
  await db.announcement.create({
    data: {
      title: title.slice(0, 120),
      body: body.slice(0, 4000),
      pinned: formData.get("pinned") === "on",
      important: formData.get("important") === "on",
      authorId: me.id,
    },
  });
  revalidatePath("/announcements");
  revalidatePath("/");
}

export async function deleteAnnouncement(id: string) {
  await requireManager();
  await db.announcement.delete({ where: { id } });
  revalidatePath("/announcements");
  revalidatePath("/");
}
