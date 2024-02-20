export type Position = {
  latitude: number;
  longitude: number;
  state: "success" | "error";
};

export type HourMetadata = {
  angel: string;
  orisha: string;
  color: string;
  ruler: string;
  Icon: () => JSX.Element;
  action: string;
};

export type City = {
  name: string;
};
