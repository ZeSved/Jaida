import { auth } from "@/firebase/firebase"
import { User, onAuthStateChanged } from "firebase/auth"
import { useState } from "react"

export function useUser() {
  const [currentUser, setCurrentUser] = useState<User | undefined>()

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurrentUser(user)
    } else {
      setCurrentUser(undefined)
    }
  })

  return currentUser
}