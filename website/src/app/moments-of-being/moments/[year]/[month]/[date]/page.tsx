export default function MomentsOnDayPage({
  params: { year, month, date },
}: {
  params: { year: string; month: string; date: string };
}) {
  return (
    <>
      Moments on Day: {month} {date}
    </>
  );
}
