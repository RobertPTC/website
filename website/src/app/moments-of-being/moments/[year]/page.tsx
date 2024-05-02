import MomentsCalendar from "app/features/moments-of-being/moments-calendar";

export default function Moments({ params }: { params: { year: string } }) {
  return <MomentsCalendar year={params.year} />;
}
