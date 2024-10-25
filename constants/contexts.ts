import { User } from "firebase/auth"
import { createContext } from "react"

export const PathContext = createContext<string[]>([])
export const UserContext = createContext<User | undefined>(undefined)