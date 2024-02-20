export function distanceBetweenTwoPoints(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) {
  // The math module contains a function
  // named toRadians which converts from
  // degrees to radians.
  const lng1Radians = (lng1 * Math.PI) / 180;
  const lng2Radians = (lng2 * Math.PI) / 180;
  const lat1Radians = (lat1 * Math.PI) / 180;
  const lat2Radians = (lat2 * Math.PI) / 180;

  // Haversine formula
  const dlon = lng2Radians - lng1Radians;
  const dlat = lat2Radians - lat1Radians;
  const a =
    Math.pow(Math.sin(dlat / 2), 2) +
    Math.cos(lat1Radians) *
      Math.cos(lat2Radians) *
      Math.pow(Math.sin(dlon / 2), 2);

  const c = 2 * Math.asin(Math.sqrt(a));

  // Radius of earth in kilometers. Use 3956
  // for miles
  const r = 3956;

  // calculate the result
  return c * r;
}
