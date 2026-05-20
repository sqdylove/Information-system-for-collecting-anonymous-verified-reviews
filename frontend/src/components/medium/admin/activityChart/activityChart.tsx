import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";
import Card from "../../../small/card/card";

export default function ActivityChart() {
  const [days, setDays] = useState<
    "7 дней" | "14 дней" | "30 дней" | "Всё время"
  >("7 дней");
  const [isOpen, setIsOpen] = useState(false);
  const currentData = chartDataByPeriod[days] || chartDataByPeriod["7 дней"];
  return (
    <Card className="h-full flex flex-col justify-between p-6!">
      <div className="flex flex-row justify-between items-center mb-2">
        <h2 className="text-[17px] font-normal">Динамика активности</h2>
        <div className="relative">
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-ui-border rounded-lg text-sm text-t-main bg-zinc-950/30 cursor-pointer hover:bg-zinc-950/60 transition-colors select-none"
          >
            <span>{days}</span>
            <svg
              className={`w-3 h-3 text-t-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          {isOpen && (
            <div className="absolute right-0 mt-1.5 w-32 bg-zinc-900 border border-ui-border rounded-lg shadow-xl z-50 overflow-hidden py-1">
              {PERIODS.map((period) => (
                <div
                  key={period}
                  onClick={() => {
                    setDays(period);
                    setIsOpen(false);
                  }}
                  className={`px-3 py-2 text-sm text-left cursor-pointer transition-colors
										${period === days ? "text-t-blue bg-zinc-800/40 font-medium" : "text-t-main hover:bg-zinc-800"}`}
                >
                  {period}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ЛЕГЕНДА ГРАФИКА */}
      <div className="flex flex-row justify-center gap-6 text-xs text-t-muted mb-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-t-blue rounded-full"></span>
          <span>Всего отзывов</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-t-green rounded-full"></span>
          <span>Прошли модерацию</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-t-red rounded-full"></span>
          <span>Заблокировано</span>
        </div>
      </div>

      {/* САМ ГРАФИК */}
      <div className="flex-1 w-full min-h-0 text-[11px] text-t-muted **:outline-none">
        <ResponsiveContainer width="100%" height="100%">
          {/* Передаем динамический массив currentData вместо статичного data */}
          <LineChart
            data={currentData}
            margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
          >
            <CartesianGrid
              stroke="#1e1e24"
              strokeDasharray="0"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              stroke="#52525b"
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis stroke="#52525b" tickLine={false} axisLine={false} />

            <Tooltip
              cursor={false}
              contentStyle={{
                backgroundColor: "#09090b",
                borderColor: "#1e1e24",
                borderRadius: "8px",
                color: "#fff",
              }}
              itemStyle={{ color: "#fff" }}
            />

            <Line
              type="linear"
              dataKey="total"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={{ fill: "#fff", stroke: "#4f46e5", strokeWidth: 2, r: 4 }}
              activeDot={false}
            />

            <Line
              type="linear"
              dataKey="moderated"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#fff", stroke: "#10b981", strokeWidth: 2, r: 4 }}
              activeDot={false}
            />

            <Line
              type="linear"
              dataKey="blocked"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: "#fff", stroke: "#ef4444", strokeWidth: 2, r: 4 }}
              activeDot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
const PERIODS = ["7 дней", "14 дней", "30 дней", "Всё время"] as const;
const chartDataByPeriod = {
  "7 дней": [
    { day: "0", total: 45, moderated: 110, blocked: 180 },
    { day: "1", total: 110, moderated: 40, blocked: 90 },
    { day: "2", total: 175, moderated: 135, blocked: 80 },
    { day: "3", total: 225, moderated: 120, blocked: 175 },
    { day: "4", total: 105, moderated: 75, blocked: 105 },
    { day: "5", total: 295, moderated: 160, blocked: 270 },
    { day: "6", total: 255, moderated: 110, blocked: 105 },
    { day: "7", total: 245, moderated: 140, blocked: 270 },
  ],
  "14 дней": [
    { day: "2", total: 90, moderated: 50, blocked: 40 },
    { day: "4", total: 140, moderated: 90, blocked: 110 },
    { day: "6", total: 210, moderated: 150, blocked: 95 },
    { day: "8", total: 180, moderated: 130, blocked: 160 },
    { day: "10", total: 310, moderated: 220, blocked: 190 },
    { day: "12", total: 280, moderated: 190, blocked: 140 },
    { day: "14", total: 420, moderated: 310, blocked: 250 },
  ],
  "30 дней": [
    { day: "5", total: 120, moderated: 80, blocked: 90 },
    { day: "10", total: 230, moderated: 140, blocked: 160 },
    { day: "15", total: 190, moderated: 110, blocked: 130 },
    { day: "20", total: 340, moderated: 260, blocked: 210 },
    { day: "25", total: 410, moderated: 320, blocked: 180 },
    { day: "30", total: 560, moderated: 440, blocked: 290 },
  ],
  "Всё время": [
    { day: "Кв1", total: 600, moderated: 450, blocked: 300 },
    { day: "Кв2", total: 1200, moderated: 900, blocked: 550 },
    { day: "Кв3", total: 1900, moderated: 1400, blocked: 800 },
    { day: "Кв4", total: 2800, moderated: 2100, blocked: 1100 },
  ],
};
