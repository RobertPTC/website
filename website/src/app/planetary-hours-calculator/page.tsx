import { getSunrise, getSunset } from "sunrise-sunset-js";
import { calculatePlanetaryHourLength } from "./utils";

export default function PlanetaryHoursCalculator() {
  const sunrise = getSunrise(40.654367384881525, -73.94701971291698);
  const sunset = getSunset(40.654367384881525, -73.94701971291698);
  return <></>;
}
