import { useState } from "react";
import { useNavigate } from "react-router";
import { Shell } from "@/components/layout/Shell";
import type { TRACK_ROWS, ALBUM_ROWS } from "@/data/revenue";
import { MonthlyModal, SongDetailModal, AlbumDetailModal } from "./revenue/RevenueModals";
import { RevenueSummaryCard } from "./revenue/RevenueSummaryCard";
import { RevenueChart } from "./revenue/RevenueChart";
import { RevenueDetailTable } from "./revenue/RevenueDetailTable";

export default function ReportsScreen() {
  const navigate = useNavigate();

  const [revenueContentType, setRevenueContentType] = useState<"music" | "audiobook" | "film">("music");
  const [showMonthlyModal, setShowMonthlyModal] = useState(false);
  const [detailPeriod, setDetailPeriod] = useState<"1m"|"3m"|"1y"|"custom">("1m");
  const [customStart, setCustomStart] = useState("2026-01");
  const [customEnd,   setCustomEnd]   = useState("2026-08");
  const [grouping, setGrouping] = useState<"track"|"album"|"service"|"label"|"artist">("track");
  const [searchQ, setSearchQ] = useState("");
  const [detailPage, setDetailPage] = useState(1);
  const [songModal, setSongModal] = useState<typeof TRACK_ROWS[0] | null>(null);
  const [albumModal, setAlbumModal] = useState<typeof ALBUM_ROWS[0] | null>(null);

  const PERIOD_LABEL: Record<string, string> = {
    "1m": "Сүүлийн 1 сар", "3m": "Сүүлийн 3 сар",
    "1y": "Сүүлийн 1 жил", "custom": `${customStart} – ${customEnd}`,
  };

  return (
    <Shell title="Тайлан" subtitle="Орлогын тайлан, дэлгэрэнгүй мэдээлэл">
      <MonthlyModal open={showMonthlyModal} onClose={() => setShowMonthlyModal(false)} />
      <SongDetailModal song={songModal} onClose={() => setSongModal(null)} periodLabel={PERIOD_LABEL[detailPeriod]} />
      <AlbumDetailModal album={albumModal} onClose={() => setAlbumModal(null)} periodLabel={PERIOD_LABEL[detailPeriod]} />

      <div className="space-y-5">
        <RevenueSummaryCard
          revenueContentType={revenueContentType}
          setRevenueContentType={setRevenueContentType}
          onWithdrawClick={() => navigate("/revenue")}
        />
        <RevenueChart
          revenueContentType={revenueContentType}
          onShowMonthly={() => setShowMonthlyModal(true)}
        />
        <RevenueDetailTable
          revenueContentType={revenueContentType}
          detailPeriod={detailPeriod}
          setDetailPeriod={setDetailPeriod}
          customStart={customStart}
          setCustomStart={setCustomStart}
          customEnd={customEnd}
          setCustomEnd={setCustomEnd}
          grouping={grouping}
          setGrouping={setGrouping}
          searchQ={searchQ}
          setSearchQ={setSearchQ}
          detailPage={detailPage}
          setDetailPage={setDetailPage}
          onSongClick={setSongModal}
          onAlbumClick={setAlbumModal}
        />
      </div>
    </Shell>
  );
}
