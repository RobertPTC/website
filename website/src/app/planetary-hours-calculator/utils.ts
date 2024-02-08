import dayjs from "dayjs"

export const calculatePlanetaryHourLength = (d1: Date, d2: Date) => dayjs(d1).diff(dayjs(d2))