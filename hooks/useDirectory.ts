import { useEffect, useState } from "react";
import { UserInfo } from "firebase/auth";

export function useDirectory(user?: UserInfo | null): UseDirectory {
  const [path, setPath] = useState<string[]>([])

  useEffect(() => {
    if (user) {
      setPath(['users', user.uid, 'user-documents'])
    }
  }, [user])

  function goForwardTo(newPath: string) {
    const combinedPath = [...path, '_sub_folders_', newPath]
    setPath(combinedPath)

    return combinedPath.join('/')
  }

  function goBackTo(oldPath: string) {
    const newPath = [...path]

    while (newPath[newPath.length - 1] !== oldPath) {
      newPath.pop()
    }

    setPath(newPath)

    return newPath.join('/')
  }

  return { goForwardTo, goBackTo, path }
}

type UseDirectory = { goForwardTo: (newPath: string) => string, goBackTo: (newPath: string) => string, path: string[] }