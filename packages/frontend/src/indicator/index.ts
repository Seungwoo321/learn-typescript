// src/indicator/index.ts

export type MonthsResponse = string[];

export interface Indicator {
  isMainIndex: boolean;
  code: string;
  codeName: string;
  codeNameEng: string;
  month: string;
  value: string;
}

export type IndicatorsResponse = Indicator[];
