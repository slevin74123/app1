import * as React from "react";
import { DayPicker, DateRange, SelectRangeEventHandler } from "react-day-picker";
import "react-day-picker/dist/style.css";

const orange = "#ffb072";
const orangeSelected = "#ff8661";
const fontFamily = '"Nunito", "Inter", "Segoe UI", Arial, sans-serif';

export default function Calendar() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2025, 5, 1),
    to: new Date(2025, 5, 30),
  });

  const handleSelect: SelectRangeEventHandler = (selected) => {
    setRange(selected);
  };

  return (
    <div
      className="rounded-2xl shadow-lg border border-[#f0ede7] bg-white p-4"
      style={{ width: 370, fontFamily }}
    >
      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleSelect}
        defaultMonth={new Date(2025, 5, 1)}
        styles={{
          caption: { fontWeight: 700, fontSize: 22, marginBottom: 8, color: '#222', letterSpacing: 0.5 },
          months: { width: "100%" },
          table: { width: "100%" },
          head_cell: { color: "#b3b3b3", fontWeight: 600, fontSize: 16, paddingBottom: 6 },
          cell: { height: 44, width: 44, padding: 0 },
        }}
        modifiersClassNames={{
          selected: "calendar-selected",
          range_start: "calendar-range-start",
          range_end: "calendar-range-end",
          range_middle: "calendar-range-middle",
        }}
        showOutsideDays
      />
      <style>{`
        .rdp {
          --rdp-accent-color: ${orange};
          --rdp-background-color: #fff;
        }
        .calendar-selected {
          background: ${orangeSelected} !important;
          color: #fff !important;
          border-radius: 12px !important;
          font-weight: 700 !important;
          z-index: 2;
        }
        .calendar-range-middle {
          background: ${orange} !important;
          color: #fff !important;
          border-radius: 0 !important;
          font-weight: 600 !important;
          z-index: 1;
        }
        .calendar-range-start {
          background: ${orange} !important;
          color: #fff !important;
          border-top-left-radius: 12px !important;
          border-bottom-left-radius: 12px !important;
          border-top-right-radius: 0 !important;
          border-bottom-right-radius: 0 !important;
          font-weight: 600 !important;
          z-index: 1;
        }
        .calendar-range-end {
          background: ${orange} !important;
          color: #fff !important;
          border-top-right-radius: 12px !important;
          border-bottom-right-radius: 12px !important;
          border-top-left-radius: 0 !important;
          border-bottom-left-radius: 0 !important;
          font-weight: 600 !important;
          z-index: 1;
        }
        .rdp-day {
          font-size: 20px !important;
          font-weight: 600 !important;
          color: #444 !important;
          border-radius: 0 !important;
          background: none !important;
          position: relative;
        }
        .rdp-day_outside {
          color: #e0e0e0 !important;
        }
        .rdp-caption_label {
          font-size: 22px !important;
          font-weight: 700 !important;
          color: #222 !important;
        }
        .rdp-nav_button {
          background: #fff3e0 !important;
          color: #ff8a65 !important;
          border-radius: 50% !important;
          width: 32px !important;
          height: 32px !important;
          box-shadow: none !important;
          border: none !important;
          margin: 0 4px !important;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px !important;
        }
        .rdp-nav_button:hover {
          background: #ffe0b2 !important;
        }
        .rdp-head_cell {
          font-family: ${fontFamily};
        }
      `}</style>
    </div>
  );
} 