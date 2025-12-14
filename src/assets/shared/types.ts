export interface ActionButton {
  icon: React.ReactNode;
  onClick: () => void;
  count?: number;
  showCount?: boolean;
}
