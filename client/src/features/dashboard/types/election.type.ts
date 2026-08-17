export interface Election {
  id: string;
  name: string;
  status: "upcoming" | "ongoing" | "concluded";
  startDate?: string;
  endDate?: string;
}
