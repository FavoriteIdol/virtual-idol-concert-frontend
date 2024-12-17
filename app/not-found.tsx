// app/not-found.tsx

import { useTranslations } from "next-intl";

export const dynamic = 'force-dynamic';

export default function NotFound() {
  const t = useTranslations();
  return <h1>{t("페이지를_찾을_수_없습니다")}</h1>;
}
