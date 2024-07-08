import IntentionForm from "./intention-form";
import Intentions from "./intentions";
import StackedBarChart from "./stacked-bar-chart";

export default function DayView() {
  return (
    <>
      <IntentionForm />
      <Intentions />
      <StackedBarChart />
    </>
  );
}
