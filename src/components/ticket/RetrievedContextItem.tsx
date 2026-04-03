import type { RetrievedContextItem as ContextItemType } from "../../data/types";
import {
  FileIcon,
  LinkIcon,
  StripeIcon,
  ZendeskIcon,
  ApprovalIcon,
} from "../icons";

interface RetrievedContextItemProps {
  item: ContextItemType;
}

function ContextIcon({ icon }: { icon: ContextItemType["icon"] }) {
  switch (icon) {
    case "memory":
      return <FileIcon className="h-4 w-4 text-text-tertiary" />;
    case "knowledge":
      return <LinkIcon className="h-4 w-4 text-text-tertiary" />;
    case "stripe":
      return <StripeIcon size={20} />;
    case "zendesk":
      return <ZendeskIcon size={20} />;
    case "approval":
      return <ApprovalIcon className="h-4 w-4" />;
  }
}

const STATUS_STYLES: Record<string, string> = {
  matches: "bg-badge-blue-soft text-badge-blue",
  retrieved: "bg-badge-purple-soft text-badge-purple",
  approved: "bg-badge-green-soft text-badge-green",
  pending: "bg-surface-tertiary text-text-tertiary",
  loading: "bg-surface-tertiary text-text-tertiary",
};

export function RetrievedContextItem({ item }: RetrievedContextItemProps) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <ContextIcon icon={item.icon} />
      <span className="text-[14px] text-text-primary">{item.label}</span>
      <span
        className={`ml-auto rounded-full px-2.5 py-0.5 text-[12px] font-medium ${
          STATUS_STYLES[item.status] ?? STATUS_STYLES.pending
        }`}
      >
        {item.statusText}
      </span>
    </div>
  );
}
