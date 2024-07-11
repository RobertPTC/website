export const secondsInMinute = 60;
export const secondsInHour = secondsInMinute * 60;

type TimerArray = [number, number, number, number, number, number];

export function secondsToTimerArray(s: number): TimerArray {
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

export function renderInactiveTimer(seconds: number) {
  const [hh, h, mm, m, ss, s] = secondsToTimerArray(seconds);
  return `${hh}${h}h${mm}${m}m${ss}${s}s`;
}

export function renderActiveTimer(seconds: number) {
  if (seconds <= 0) return "0s";
  const timeString = renderInactiveTimer(seconds);
  const firstDigitIndex = timeString.search(/[1-9]/);
  return timeString.slice(firstDigitIndex);
}

export function timerArrayToSeconds(timer: TimerArray) {
  const [hh, h, mm, m, ss, s] = timer;
  return (
    hh * secondsInHour * 10 +
    h * secondsInHour +
    mm * secondsInMinute * 10 +
    m * secondsInMinute +
    ss * 10 +
    s
  );
}

export function parseTimerInput(input: string): string {
  const replaced = input.replace(/\D/g, "");
  return replaced
    .substring(replaced.length - 6, replaced.length)
    .padStart(6, "0");
}

export function timerInputToTimerArray(input: string): TimerArray {
  const p = parseTimerInput(input);
  return p.split("").map((n) => Number(n)) as TimerArray;
}

export function interpolateTimeDivisions(input: string): string {
  const [hh, h, mm, m, ss, s] = timerInputToTimerArray(input);
  return `${hh}${h}h${mm}${m}m${ss}${s}s`;
}

export const timeGroups = ["h", "m", "s"];
