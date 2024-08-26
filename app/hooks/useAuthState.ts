import { auth } from "@/firebase/firebase"
import { onAuthStateChanged, User } from "firebase/auth"
import { useEffect, useState } from "react"

export function useAuthState() {
	const [user, setUser] = useState<User | undefined>(undefined)

	useEffect(() => {
		const unSubscribe = onAuthStateChanged(auth, (result) => {
			if (result) {
				setUser(result)
			} else {
				setUser(undefined)
			}
		})

		return () => unSubscribe()
	}, [])

	return user
}