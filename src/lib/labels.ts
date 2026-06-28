// Turkish UI labels for enum values. Identifiers stay English in the DB.
import type {
  Priority, ProjectStatus, TaskStatus, TaskOwner,
  PlanStatus, ServiceType, ServiceStatus, OutputType, UserRole,
} from "@/lib/types/db";

export const priorityLabel: Record<Priority, string> = {
  low: "Dusuk", medium: "Orta", high: "Yuksek", urgent: "Acil",
};

export const projectStatusLabel: Record<ProjectStatus, string> = {
  planned: "Planlandi", active: "Aktif", on_hold: "Beklemede",
  done: "Tamamlandi", cancelled: "Iptal",
};

export const taskStatusLabel: Record<TaskStatus, string> = {
  todo: "Yapilacak", in_progress: "Devam ediyor",
  blocked: "Engelli", done: "Tamam",
};

export const taskOwnerLabel: Record<TaskOwner, string> = {
  self: "Solo", with_manager: "Birlikte", service: "Dis Hizmet",
};

export const planStatusLabel: Record<PlanStatus, string> = {
  planned: "Planlandi", on_track: "Yolunda", at_risk: "Riskli", done: "Tamam",
};

export const serviceTypeLabel: Record<ServiceType, string> = {
  photography: "Fotograf", graphic_design: "Grafik Tasarim", web: "Web",
  framing: "Cerceve", shipping: "Nakliye", catalog: "Katalog",
  pr: "PR", printing: "Baski", other: "Diger",
};

export const serviceStatusLabel: Record<ServiceStatus, string> = {
  requested: "Talep edildi", in_progress: "Devam ediyor",
  delivered: "Teslim edildi", paid: "Odendi", cancelled: "Iptal",
};

export const outputTypeLabel: Record<OutputType, string> = {
  portfolio: "Portfolyo", cv: "CV", statement: "Artist Statement",
  exhibition_file: "Sergi Dosyasi", price_list: "Fiyat Listesi",
  photo: "Fotograf", video: "Video", press: "Basin Bulteni",
};

export const roleLabel: Record<UserRole, string> = {
  admin: "Yonetici", manager: "Menajer", assistant: "Asistan", artist: "Sanatci",
};
