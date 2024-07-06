export function secondsToTimerArray(
  s: number
): [number, number, number, number, number, number] {
  if (s <= 0)
    return new Array(6).fill(0) as [
      number,
      number,
      number,
      number,
      number,
      number
    ];
  const minutes = (s / 60) | 0;
  const seconds = s - minutes * 60;
  const hours = (minutes / 60) | 0;
  const secondsString = seconds.toString().padStart(2, "0").split("");
  const minuteString = (minutes % 60).toString().padStart(2, "0").split("");
  const hoursString = hours.toString().padStart(2, "0").split("");

  return [
    Number(hoursString[0]),
    Number(hoursString[1]),
    Number(minuteString[0]),
    Number(minuteString[1]),
    Number(secondsString[0]),
    Number(secondsString[1]),
  ];
}

export function renderActiveTimer(seconds: number) {
  const [hh, h, mm, m, ss, s] = secondsToTimerArray(seconds);
  const timeString = `${hh}${h}h${mm}${m}m${ss}${s}s`;
  const firstDigitIndex = timeString.search(/[1-6]/);
  return timeString.slice(firstDigitIndex);
}

export const timeGroups = ["h", "m", "s"];
