export type RawDiary = {
  inner_user_id: number;
  diary_id: number;
  date: string;
  update_date: string;
  wheather: number;
  feeling: number;
  text: string;
};

export type Diary = {
  inner_user_id?: number;
  diary_id?: number;
  date: Date;
  update_date?: Date;
  wheather: number;
  feeling: number;
  text: string;
  onSave?: (diary: Diary) => Promise<any>;
  onDelete?: () => Promise<any>;
  onCancel?: () => Promise<any>;
};

const Wheather = {
  SUNNY: 0,
  CLOUDY: 1,
  RAINY: 2,
  THUNDER: 3,
  SNOW: 4,
  WIND: 5
} as const;
type Wheather = typeof Wheather[keyof typeof Wheather];

function decodeWheather(wheather: number): string {
  switch(wheather) {
    case(Wheather.SUNNY):
      return '🔆';
    case(Wheather.CLOUDY):
      return '☁';
    case(Wheather.RAINY):
      return '☔';
    case(Wheather.THUNDER):
      return '⚡';
    case(Wheather.SNOW):
      return '⛄';
    case(Wheather.WIND):
      return '🌀';
    default:
      return '🔆';
  };
}

const Feeling = {
  HAPPY: 0,
  NORMAL: 1,
  LIT_SAD: 2,
  SAD: 3,
  ANGRY: 4
} as const;
type Feeling = typeof Feeling[keyof typeof Feeling];

function decodeFeeling(feeling: number): string {
  switch(feeling) {
    case(Feeling.HAPPY):
      return '😀';
    case(Feeling.NORMAL):
      return '😐';
    case(Feeling.LIT_SAD):
      return '😥';
    case(Feeling.SAD):
      return '😭';
    case(Feeling.ANGRY):
      return '😡';
    default:
      return '😀';
  };
}

export { Wheather, decodeWheather, Feeling, decodeFeeling };