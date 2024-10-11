import { useState } from "react";

export function useDirectory(userUID: string):
  [(newPath: string | string[]) => string, (newPath: string) => string, string] {
  const [path, setPath] = useState<string[]>(['users', userUID, 'user-documents'])

  function goForwardTo(newPath: string | string[]) {
    if (typeof newPath === 'string') {
      setPath([...path, newPath])
    } else {
      setPath([...path, ...newPath])
    }

    return path.join('/')
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

    return path.join('/')
  }

  return [goForwardTo, goBackTo, path.join('/')]
}