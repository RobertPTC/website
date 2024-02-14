import * as Icons from "./icons";
import { HourMetadata } from "./types";

type PlanetaryHoursConfig = {
  day: HourMetadata[];
  night: HourMetadata[];
};

type Days = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const TheSun: HourMetadata = {
  Icon: Icons.Sun,
  action:
    "For career success, employment, promotion, making presentations, public speaking, improving social status, approaching authority figures, improving health.",
  angel: "Uriel",
  color: "#ffd700",
  orisha: "Obatala",
  ruler: "The Sun",
};

const Venus: HourMetadata = {
  Icon: Icons.Venus,
  action:
    "For social occasions, love, courtship, marriage, improving appearance, for financial investments, to reconcile after a disagreement, to mediate a dispute, to achieve calm after stress, to work for peace.",
  angel: "Haniel",
  color: "#50c878",
  orisha: "Shango",
  ruler: "Venus",
};

const Mercury: HourMetadata = {
  Icon: Icons.Mercury,
  action:
    "For abstract thinking, mental alertness, speaking, signing papers, sending significant mail, fixing computer problems, or in general, for any activity related to communication, provided you are in the frame of mind to be logical and rational. (Mercury can be a trickster when you are mentally fogged or emotionally upset.)",
  angel: "Raphael",
  color: "#edd194",
  orisha: "Babalu-Aye",
  ruler: "Mercury",
};

const TheMoon: HourMetadata = {
  Icon: Icons.Moon,
  action:
    "For doing things that are likely to change or are not intended to be permanent or binding, for increased intuition or imagination, for all domestic activities.",
  angel: "Gabriel",
  color: "#c0c0c0",
  orisha: "Papa Legba",
  ruler: "The Moon",
};

const Saturn: HourMetadata = {
  Icon: Icons.Saturn,
  action:
    "For getting organized, plowing through tedious work, breaking unwanted habits, accepting and dealing with responsibilities, and for contemplation or meditation especially if you find yourself feeling tired and needing a respite from activity.",
  angel: "Cassiel",
  color: "#0a0a0a",
  orisha: "Yemaya",
  ruler: "Saturn",
};

const Jupiter: HourMetadata = {
  Icon: Icons.Jupiter,
  action:
    "For success in just about any activity you can imagine and for beginning anything important. The only downside would be where a tendency to over-indulgence or excess is a factor.",
  angel: "Tzadkiel",
  color: "#9966cc",
  orisha: "Olodumare",
  ruler: "Jupiter",
};

const Mars: HourMetadata = {
  Icon: Icons.Mars,
  action:
    "Good for activities that require muscular exertion, boldness, courage and active enterprise, when your feelings are in check. Caution is needed if you are angry or stressed, and especially if a relationship is involved, for Mars can be confrontational.",
  angel: "Azazel",
  color: "#9b111e",
  orisha: "Ogun",
  ruler: "Mars",
};

export const planetaryHoursMap: Record<Days, PlanetaryHoursConfig> = {
  0: {
    day: [
      TheSun,
      Venus,
      Mercury,
      TheMoon,
      Saturn,
      Jupiter,
      Mars,
      TheSun,
      Venus,
      Mercury,
      TheMoon,
      Saturn,
    ],
    night: [
      Jupiter,
      Mars,
      TheSun,
      Venus,
      Mercury,
      TheMoon,
      Saturn,
      Jupiter,
      Mars,
      TheSun,
      Venus,
      Mercury,
    ],
  },
  1: {
    day: [
      TheMoon,
      Saturn,
      Jupiter,
      Mars,
      TheSun,
      Venus,
      Mercury,
      TheMoon,
      Saturn,
      Jupiter,
      Mars,
      TheSun,
    ],
    night: [
      Venus,
      Mercury,
      TheMoon,
      Saturn,
      Jupiter,
      Mars,
      TheSun,
      Venus,
      Mercury,
      TheMoon,
      Saturn,
      Jupiter,
    ],
  },
  2: {
    day: [
      Mars,
      TheSun,
      Venus,
      Mercury,
      TheMoon,
      Saturn,
      Jupiter,
      Mars,
      TheSun,
      Venus,
      Mercury,
      TheMoon,
    ],
    night: [
      Venus,
      Mercury,
      TheMoon,
      Saturn,
      Jupiter,
      Mars,
      TheSun,
      Venus,
      Mercury,
      TheMoon,
      Saturn,
      Jupiter,
    ],
  },
  3: {
    day: [
      Mercury,
      TheMoon,
      Saturn,
      Jupiter,
      Mars,
      TheSun,
      Venus,
      Mercury,
      TheMoon,
      Saturn,
      Jupiter,
      Mars,
    ],
    night: [
      TheSun,
      Venus,
      Mercury,
      TheMoon,
      Saturn,
      Jupiter,
      Mars,
      TheSun,
      Venus,
      Mercury,
      TheMoon,
      Saturn,
    ],
  },
  4: {
    day: [
      Jupiter,
      Mars,
      TheSun,
      Venus,
      Mercury,
      TheMoon,
      Saturn,
      Jupiter,
      Mars,
      TheSun,
      Venus,
      Mercury,
    ],
    night: [
      TheMoon,
      Saturn,
      Jupiter,
      Mars,
      TheSun,
      Venus,
      Mercury,
      TheMoon,
      Saturn,
      Jupiter,
      Mars,
      TheSun,
    ],
  },
  5: {
    day: [],
    night: [],
  },
  6: {
    day: [],
    night: [],
  },
};
