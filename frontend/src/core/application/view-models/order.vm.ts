/** Render-ready order shape. Plain + serializable. */
export interface OrderVm {
  id: string;
  statusLabel: string;
  isComplete: boolean;
  amountText: string;
  downloadUrl: string | null; // present once fulfilled
}
