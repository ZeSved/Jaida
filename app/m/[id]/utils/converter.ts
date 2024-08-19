import style from '../m-d-editor.module.scss'
import { Dispatch, SetStateAction } from "react"

const conversions = [
  {
    condition: (text: string) => {
      if (text.startsWith('**') && text.endsWith('**') && text !== '**') return true
      else return false
    },
    function: (text: string) => {
      const span = document.createElement('span')
      span.style.fontWeight = 'bold'
      span.appendChild(document.createTextNode(text.replaceAll('**', '')))

      return span.outerHTML
    }
  },
  {
    condition: (text: string) => {
      if (text.startsWith('*') && text.endsWith('*') && text !== '*') return true
      else return false
    },
    function: (text: string) => {
      const span = document.createElement('span')
      span.style.fontStyle = 'italic'
      span.appendChild(document.createTextNode(text.replaceAll('*', '')))

      return span.outerHTML
    }
  },
  {
    condition: (text: string) => {
      if (/\S+/.test(text[0])) return true
      else return false
    },
    function: (text: string) => { return text }
  },
]

export function converter(text: string, setCurrentText: Dispatch<SetStateAction<string>>) {
  // const textArray = text.match(/\w+|\s+/g)
  const textArray = text.match(/\S+|\s+/g)
  console.log(textArray)
  console.log(text)
  const newArray: string[] = []

  textArray?.forEach(t => {
    if (t.startsWith(' ')) {
      const tArr = t.split('')

      tArr.forEach(s => {
        const span = document.createElement('span')
        span.className = style.space
        newArray.push(span.outerHTML)
      })
    }

    // for (const convert of conversions) {
    //   console.log(1)
    //   if (convert.condition(t)) {
    //     console.log(2)
    //     newArray.push(convert.function(t))
    //   }
    // }
    if (text.startsWith('**') && text.endsWith('**') && text !== '**') {
      const span = document.createElement('span')
      span.style.fontWeight = 'bold'
      span.appendChild(document.createTextNode(t.replaceAll('**', '')))
      newArray.push(span.outerHTML)
    }

    if (t.startsWith('*') && t.endsWith('*') && t !== '*') {
      // console.log('workds')
      const span = document.createElement('span')
      span.style.fontStyle = 'italic'
      span.appendChild(document.createTextNode(t.replaceAll('*', '')))
      newArray.push(span.outerHTML)
    } else newArray.push(t)


  })

  console.log(newArray)

  setCurrentText(newArray.join(''))
}