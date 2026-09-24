import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Music2, TrendingUp, DollarSign, ChevronRight, AlertCircle, Plus,
  BookOpen, Film, CheckCircle2, Clock, LayoutGrid, ArrowRight,
  Headphones,
} from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/Card";
import { Btn } from "@/components/ui/Btn";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { RELEASES } from "@/data/releases";
import type { ReleaseData } from "@/types";

function typeLabel(r: ReleaseData) {
  if (r.contentType === "audiobook") return "Аудио ном";
  if (r.contentType === "film")      return "Кино";
  if (r.type === "Single") return "Дуу";
  if (r.type === "EP")     return "EP";
  return "Цомог";
}

const ADD_TYPES = [
  { id: "music",     label: "Хөгжим",    sub: "Дуу, EP, Цомог",          icon: Music2,   color: "text-primary",   bg: "bg-primary/10",  path: "/submit/release" },
  { id: "audiobook", label: "Аудио ном", sub: "Бүлэгтэй номын аудио",    icon: BookOpen, color: "text-violet-600", bg: "bg-violet-100",  path: "/submit/audiobook" },
  { id: "film",      label: "Кино",      sub: "Уран сайхны, баримтат",   icon: Film,     color: "text-rose-600",   bg: "bg-rose-100",    path: "/submit/film" },
];

export default function DashboardScreen() {
  const navigate = useNavigate();

  const music      = RELEASES.filter(r => r.contentType === "music");
  const audiobooks = RELEASES.filter(r => r.contentType === "audiobook");
  const films      = RELEASES.filter(r => r.contentType === "film");

  const distributed = RELEASES.filter(r => r.status === "distributed").length;
  const draft       = RELEASES.filter(r => r.status === "draft").length;
  const waiting     = RELEASES.filter(r => r.status === "reviewing" || r.status === "submitted").length;
  const revision    = RELEASES.filter(r => r.status === "revision").length;

  const recentContent = [...RELEASES].reverse().slice(0, 8);

  return (
    <Shell title="Хяналтын самбар">
      {/* Alert banner — DO NOT CHANGE */}
      <div className="mb-6 rounded-2xl p-5 text-primary-foreground flex items-start gap-4 shadow-sm bg-primary">
        <div className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center flex-shrink-0">
          <AlertCircle size={18} className="text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">Аккаунтын баталгаажуулалт дутуу байна</p>
          <p className="text-primary-foreground/60 text-xs mt-0.5 leading-relaxed">Орлого авахын тулд KYC болон банкны мэдээллээ бүрэн оруулна уу.</p>
        </div>
        <button type="button" onClick={() => navigate("/account")}
          className="text-xs font-semibold text-primary-foreground/70 hover:text-primary-foreground flex items-center gap-1 flex-shrink-0 whitespace-nowrap mt-0.5">
          Үзэх <ChevronRight size={13} />
        </button>
      </div>

      {/* 4 stat cards — all self-start so content aligns to top inside equal-height cells */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 items-stretch">

        {/* 1 — Нийт контент */}
        <Card className="p-5 flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
              <Music2 size={18} className="text-primary" />
            </div>
          </div>
          <p className="text-xs font-semibold text-muted-foreground mb-1">Нийт контент</p>
          <div className="text-2xl font-extrabold text-foreground mb-3">{RELEASES.length}</div>
          <div className="space-y-2 mt-auto">
            {[
              { label: "Хөгжим",    count: music.length,      color: "bg-primary",    text: "text-primary" },
              { label: "Аудио ном", count: audiobooks.length, color: "bg-violet-500", text: "text-violet-600" },
              { label: "Кино",      count: films.length,      color: "bg-rose-500",   text: "text-rose-600" },
            ].map(({ label, count, color, text }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground w-[4.5rem] flex-shrink-0">{label}</span>
                <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${color}`}
                    style={{ width: `${Math.round((count / RELEASES.length) * 100)}%` }} />
                </div>
                <span className={`text-[11px] font-extrabold tabular-nums w-4 text-right ${text}`}>{count}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* 2 — Нийт орлого (gradient, clickable, no "Нийт" badge) */}
        <div role="button" tabIndex={0} onClick={() => navigate("/revenue")}
          onKeyDown={e => e.key === "Enter" && navigate("/revenue")}
          className="relative rounded-2xl p-5 overflow-hidden cursor-pointer group transition-all hover:scale-[1.015] hover:shadow-xl focus:outline-none flex flex-col"
          style={{ background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 55%, #1a0030) 100%)" }}>
          {/* Decorative orbs */}
          <div className="absolute -top-5 -right-5 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute -bottom-8 -right-3 w-24 h-24 rounded-full bg-white/8 pointer-events-none" />

          <div className="relative flex flex-col h-full">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                <TrendingUp size={18} className="text-white" />
              </div>
              <ChevronRight size={16} className="text-white/40 group-hover:text-white/80 transition-colors mt-0.5" />
            </div>
            <p className="text-xs font-semibold text-white/70 mb-1">Нийт орлого</p>
            <div className="text-2xl font-extrabold text-white">₮ 842,500</div>
            <div className="mt-2.5">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/15 border border-white/20">
                <span className="text-[10px] font-bold text-white/90">Бүх хугацааны нийлбэр</span>
              </span>
            </div>
          </div>
        </div>

        {/* 3 — Идэвхтэй түгээлт */}
        <Card className="p-5 flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={18} className="text-blue-600" />
            </div>
          </div>
          <p className="text-xs font-semibold text-muted-foreground mb-1">Идэвхтэй түгээлт</p>
          <div className="text-2xl font-extrabold text-foreground mb-3">{distributed} / {RELEASES.length}</div>
          <div className="space-y-2 mt-auto">
            <div className="flex items-center gap-2">
              <Clock size={11} className="text-blue-500 flex-shrink-0" />
              <span className="text-[11px] text-muted-foreground flex-1">Хүлээгдэж байна</span>
              <span className="text-[11px] font-extrabold text-foreground tabular-nums">{waiting}</span>
            </div>
            <div className="flex items-center gap-2">
              <LayoutGrid size={11} className="text-zinc-400 flex-shrink-0" />
              <span className="text-[11px] text-muted-foreground flex-1">Ноорог</span>
              <span className="text-[11px] font-extrabold text-foreground tabular-nums">{draft}</span>
            </div>
            {revision > 0 && (
              <div className="flex items-center gap-2">
                <AlertCircle size={11} className="text-amber-500 flex-shrink-0" />
                <span className="text-[11px] text-muted-foreground flex-1">Засвар</span>
                <span className="text-[11px] font-extrabold text-foreground tabular-nums">{revision}</span>
              </div>
            )}
          </div>
        </Card>

        {/* 4 — Энэ сарын орлого (clickable → revenue) */}
        <div role="button" tabIndex={0} onClick={() => navigate("/revenue")}
          onKeyDown={e => e.key === "Enter" && navigate("/revenue")}
          className="rounded-2xl border border-border bg-card p-5 cursor-pointer group hover:border-amber-300/60 hover:shadow-sm transition-all focus:outline-none flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
              <DollarSign size={18} className="text-amber-600" />
            </div>
            <span className="text-xs font-semibold text-muted-foreground">2026-08</span>
          </div>
          <p className="text-xs font-semibold text-muted-foreground mb-1">Энэ сарын орлого</p>
          <div className="text-2xl font-extrabold text-foreground">₮ 125,000</div>
          <div className="flex items-center justify-between mt-auto pt-3">
            <span className="text-xs text-emerald-600 font-semibold">▲ +8.3% өмнөх сараас</span>
            <ChevronRight size={13} className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent content */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-bold text-foreground text-sm">Сүүлийн контент</h3>
              <button type="button" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => navigate("/catalog")}>Бүгдийг харах</button>
            </div>
            <div className="divide-y divide-border/40">
              {recentContent.map(r => {
                const Icon   = r.contentType === "audiobook" ? BookOpen : r.contentType === "film" ? Film : Music2;
                const iconBg = r.contentType === "audiobook" ? "bg-violet-600" : r.contentType === "film" ? "bg-rose-600" : "bg-foreground";
                return (
                  <div key={r.id}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => navigate(
  r.contentType === "film" ? `/catalog/film/film?id=${r.id}` :
  r.contentType === "audiobook" ? `/catalog/audiobook/book?id=${r.id}` :
  `/catalog/music/release?id=${r.id}`
)}>
                    <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={14} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground text-sm truncate">{r.title}</p>
                        {r.status === "revision" && (
                          <span className="text-xs bg-destructive/10 text-destructive font-bold px-1.5 py-0.5 rounded flex-shrink-0">Засвар</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{r.primaryArtist} · {typeLabel(r)}</p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Add content */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-bold text-foreground text-sm">Контент нэмэх</h3>
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Plus size={14} className="text-primary-foreground" />
              </div>
            </div>
            <div className="p-3 space-y-1.5">
              {ADD_TYPES.map(({ id, label, sub, icon: Icon, color, bg, path }) => (
                <button key={id} type="button" onClick={() => navigate(path)}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted/40 transition-colors group text-left">
                  <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={16} className={color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                    <p className="text-[11px] text-muted-foreground">{sub}</p>
                  </div>
                  <ArrowRight size={14} className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors flex-shrink-0" />
                </button>
              ))}
            </div>
          </Card>

          {/* Help */}
          <Card className="p-5 bg-muted/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-border flex items-center justify-center">
                <Headphones size={16} className="text-foreground/70" />
              </div>
              <h3 className="font-bold text-foreground text-sm">Тусламж авах</h3>
            </div>
            <Btn variant="secondary" size="sm" full onClick={() => navigate("/help")}>Тусламжийн хэсэг</Btn>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
