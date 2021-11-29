export type IStage = 'Open' | 'Confirmed' | 'False Positive' | 'Fixed';

export interface ICard {
  id: string;
  text: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IList {
  id: string;
  title: IStage;
  cards: ICard[];
}

export interface IRepo {
  id: string;
  name: string;
  lists: IList[];
}
