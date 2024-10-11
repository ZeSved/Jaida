import { useState } from "react";
import { useAuthState } from "./useAuthState";

export function useDirectory(): UseDirectory {
  const user = useAuthState()
  const [path, setPath] = useState<string[]>(['users', user!.uid, 'user-documents'])

  function goForwardTo(newPath: string | string[]) {
    if (typeof newPath === 'string') {
      const combinedPath = [...path, newPath]
      setPath(combinedPath)

      return combinedPath.join('/')
    } else {
      const combinedPath = [...path, ...newPath]
      setPath(combinedPath)

      return combinedPath.join('/')
    }
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

  return [goForwardTo, goBackTo, path.join('/')]
}

type UseDirectory = [(newPath: string | string[]) => string, (newPath: string) => string, string]