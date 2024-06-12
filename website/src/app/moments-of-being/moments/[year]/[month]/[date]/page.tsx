import MomentsOnDay from "app/features/moments-of-being/moments-on-day";

export default function MomentsOnDayPage({
  params: { year, month, date },
}: {
  params: { year: string; month: string; date: string };
}) {
  return <MomentsOnDay year={year} month={month} date={date} />;
}
