import MomentsOnDay from "app/(pages)/moments-of-being/moments-on-day";

export default function MomentsOnDayPage({
  params: { year, month, date },
}: {
  params: { year: string; month: string; date: string };
}) {
  return <MomentsOnDay year={year} month={month} date={date} />;
}
