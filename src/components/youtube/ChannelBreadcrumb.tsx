import Link from "next/link";

type Props = {
  title: string;
};

export default function ChannelBreadcrumb({ title }: Props) {
  return (
    <div className="text-sm text-gray-500">
      <Link href="/dashboard" className="hover:text-indigo-600">
        Dashboard
      </Link>{" "}
      / YouTube / {title}
    </div>
  );
}
