export type CardData = {
  date: string;
  pay: number;
  isBenefit?: boolean;
};

export type Benefit = {
  [key: string]: number;
};

export type Interval = {
  start: Date;
  end: Date;
};

export type BackupData = {
  benefits: Benefit;
  debts: CardData[] | null;
};

export type TypeText = 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
