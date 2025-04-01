export interface CyclingRequest {
  startPoint: string;
  preferences: {
    distance?: number;
    difficulty?: string;
    sceneryType?: string[];
    timeOfDay?: string;
  };
}

export interface CyclingRoute {
  startPoint: [number, number];
  endPoint: [number, number];
  waypoints: Array<[number, number]>;
  distance: number;
  duration: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  tips: string[];
}
