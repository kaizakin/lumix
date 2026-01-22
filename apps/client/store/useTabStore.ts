import { create } from 'zustand'

export enum Tabenum {
  Storm = 'storm',
  Scribble = 'scribble',
  Text = 'text',
  Schedule = 'schedule'
}


type tabState = {
  currentTab: Tabenum
  setTab: (tab: Tabenum) => void
}

export const useTabStore = create<tabState>((set) => ({
  currentTab: Tabenum.Storm,
  setTab: (tab => set({currentTab: tab}))
}))
