"use client";

import { IconButton, Row, Text } from "@once-ui-system/core";

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
    <Row
      vertical="center"
      gap="4"
      paddingRight="12"
      marginRight="8"
      borderRight="neutral-alpha-weak"
      style={{ flexShrink: 0 }}
    >
      <IconButton
        variant={isFirst || disabled ? "ghost" : "secondary"}
        size="s"
        icon="chevronUp"
        disabled={isFirst || disabled}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          onUp();
        }}
        tooltip="Geser ke Atas"
      />
      <Text
        variant="label-strong-xs"
        onBackground="neutral-medium"
        style={{ minWidth: 22, textAlign: "center", fontVariantNumeric: "tabular-nums" }}
      >
        #{order}
      </Text>
      <IconButton
        variant={isLast || disabled ? "ghost" : "secondary"}
        size="s"
        icon="chevronDown"
        disabled={isLast || disabled}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          onDown();
        }}
        tooltip="Geser ke Bawah"
      />
    </Row>
  );
}
