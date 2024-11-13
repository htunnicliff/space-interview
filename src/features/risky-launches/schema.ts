export type RiskType = "crew_with_reusable_cores" | "asteroid";

export type RiskyLaunch = {
  launch_id: string;
  crew_count: number;
  risk_type: RiskType;
};
