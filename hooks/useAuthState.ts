import { auth } from "@/db/firebase"
import { onAuthStateChanged, User } from "firebase/auth"
import { useEffect, useState } from "react"

export function useAuthState() {
	const [user, setUser] = useState<User | undefined | null>(null)

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