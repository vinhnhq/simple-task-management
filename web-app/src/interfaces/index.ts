export interface ICard {
  id: string
  text: string
}

export interface IList {
  id: number
  title: 'Open' | 'Confirmed' | 'False Positive' | 'Fixed'
  cards: ICard[]
}

export interface IRepo {
  id: string
  name: string
  lists: IList[]
}
