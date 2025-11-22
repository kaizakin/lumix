import { create } from 'zustand'

export enum Tabenum {
  Home = 'home',
  Canvas = 'canvas',
  Chat = 'chat',
  Files = 'files',
  Schedule = 'schedule'
}


type tabState = {
  currentTab: Tabenum
  setTab: (tab: Tabenum) => void
}

export const useTabStore = create<tabState>((set) => ({
  currentTab: Tabenum.Home,
  setTab: (tab => set({currentTab: tab}))
}))
