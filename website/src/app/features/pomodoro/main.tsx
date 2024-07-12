import dayjs from "dayjs";

import IntentionForm from "./intention-form";
import Intentions from "./intentions";
import StackedBarChart from "./stacked-bar-chart";

export default function Main() {
  const now = dayjs();

  return (
    <>
      <IntentionForm />
      <Intentions />
      <StackedBarChart type="month" />
    </>
  );
}
