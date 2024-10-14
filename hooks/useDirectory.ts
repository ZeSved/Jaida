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
    // console.log(combinedPath)
    setPath(combinedPath)

    return combinedPath.join('/')
  }

  function goBackTo(newPath: string) {
    if (path.length === 3) return path.join('/')
    const editedArray = [...path]

    for (let i = path.length - 1; i > 3; i--) {
      if (path[i] !== newPath) {
        editedArray.filter(item => item !== path[i])
      } else {
        setPath([...editedArray])
        break
      }
    }

    return editedArray.join('/')
  }

  return { goForwardTo, goBackTo, path }
}

type UseDirectory = { goForwardTo: (newPath: string) => string, goBackTo: (newPath: string) => string, path: string[] }