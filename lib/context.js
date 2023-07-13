import { createContext } from "react";

export const UserContext = createContext({ user: null, chashcin: false })
export const WalletContext = createContext({ current: 0, total: 0 })