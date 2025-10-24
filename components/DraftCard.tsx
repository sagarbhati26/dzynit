export default function DraftCard({
    title = "Untitled",
    date = "—",
  }: {
    title?: string;
    date?: string;
  }) {
    return (
      <div className="rounded-2xl card-glass p-3 soft-shadow">
        <div className="h-36 bg-sand rounded-md" />
        <div className="mt-3">
          <div className="font-medium">{title}</div>
          <div className="text-sm text-muted mt-1">{date}</div>
        </div>
      </div>
    );
  }