"use client";

interface OrderButtonsProps {
  order: number;
  isFirst: boolean;
  isLast: boolean;
  onUp: () => void;
  onDown: () => void;
  disabled?: boolean;
}

export default function OrderButtons({
  order,
  isFirst,
  isLast,
  onUp,
  onDown,
  disabled,
}: OrderButtonsProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "3px",
        paddingRight: "10px",
        marginRight: "6px",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
        flexShrink: 0,
      }}
    >
      <button
        type="button"
        disabled={isFirst || disabled}
        onClick={(e) => {
          e.stopPropagation();
          onUp();
        }}
        title="Geser ke Atas"
        style={{
          width: "26px",
          height: "20px",
          borderRadius: "4px",
          background:
            isFirst || disabled ? "rgba(255, 255, 255, 0.02)" : "rgba(16, 185, 129, 0.12)",
          border:
            isFirst || disabled
              ? "1px solid rgba(255, 255, 255, 0.05)"
              : "1px solid rgba(16, 185, 129, 0.3)",
          color: isFirst || disabled ? "rgba(255, 255, 255, 0.2)" : "#10b981",
          cursor: isFirst || disabled ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "10px",
          lineHeight: 1,
          transition: "all 0.15s ease",
        }}
      >
        ▲
      </button>
      <span
        style={{
          fontSize: "11px",
          fontWeight: 700,
          color: "rgba(255, 255, 255, 0.8)",
          minWidth: "22px",
          textAlign: "center",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        #{order}
      </span>
      <button
        type="button"
        disabled={isLast || disabled}
        onClick={(e) => {
          e.stopPropagation();
          onDown();
        }}
        title="Geser ke Bawah"
        style={{
          width: "26px",
          height: "20px",
          borderRadius: "4px",
          background: isLast || disabled ? "rgba(255, 255, 255, 0.02)" : "rgba(16, 185, 129, 0.12)",
          border:
            isLast || disabled
              ? "1px solid rgba(255, 255, 255, 0.05)"
              : "1px solid rgba(16, 185, 129, 0.3)",
          color: isLast || disabled ? "rgba(255, 255, 255, 0.2)" : "#10b981",
          cursor: isLast || disabled ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "10px",
          lineHeight: 1,
          transition: "all 0.15s ease",
        }}
      >
        ▼
      </button>
    </div>
  );
}
