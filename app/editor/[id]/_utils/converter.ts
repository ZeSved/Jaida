import style from '../m-d-editor.module.scss'
import { Dispatch, SetStateAction } from "react"

const conversions = [
  {
    condition: (text: string) => { return /^\*\*\S+\*\*$/.test(text) },
    function: (text: string) => {
      const span = document.createElement('span')
      span.style.fontWeight = 'bold'
      span.appendChild(document.createTextNode(text.replace(/^\*\*/, '').replace(/\*\*$/, '')))

      // return span.outerHTML
      return span
    }
  },
  {
    condition: (text: string) => { return /^\*\S+\*$/.test(text) },
    function: (text: string) => {
      const span = document.createElement('span')
      span.style.fontStyle = 'italic'
      span.appendChild(document.createTextNode(text.replace(/^\*/, '').replace(/\*$/, '')))

      // return span.outerHTML
      return span
    }
  },
  {
    condition: (text: string) => { return /^\~\~\S+\~\~$/.test(text) },
    function: (text: string) => {
      const span = document.createElement('span')
      span.style.textDecoration = 'line-through'
      span.appendChild(document.createTextNode(text.replace(/^\~\~/, '').replace(/\~\~$/, '')))

      // return span.outerHTML
      return span
    }
  },
  {
    condition: (text: string) => { return /^\#/.test(text) },
    function: (text: string) => {
      const h1 = document.createElement('h1')
      h1.appendChild(document.createTextNode(text.replace('#', '')))

      // return h1.outerHTML
      return h1
    }
  },
  {
    // condition: (text: string) => { return /^[^*#>]*$/.test(text) },
    condition: (text: string) => { return true },
    function: (text: string) => {
      const span = document.createElement('span')
      span.appendChild(document.createTextNode(text))

      // return span.outerHTML
      return span
    }
  },
]

export function converter(text: string, setCurrentText: Dispatch<SetStateAction<string>>) {
  // const textArray = text.match(/\w+|\s+/g)
  const textArray = text.match(/\S+|\s+/g)
  const e = text.split(/\r\n|\r|\n/)
  console.log(e)
  console.log(text)
  const newArray: string[] = []

  e.forEach(el => {
    const div = document.createElement('div')
    console.log(el)

    if (el === '') {
      const div = document.createElement('div')
      div.className = style.emptyRow
      div.textContent = 'n'
      newArray.push(div.outerHTML)
    }

    el.match(/\S+|\s+/g)?.forEach(t => {
      if (t.startsWith(' ')) {
        const tArr = t.split('')
        tArr.forEach(s => {
          const span = document.createElement('span')
          span.className = style.space
          div.appendChild(span)
          // newArray.push(span.outerHTML)
        })
      }

      for (const convert of conversions) {
        if (convert.condition(t)) {
          // newArray.push(convert.function(t))
          div.appendChild(convert.function(t))

          break
        }
      }
    })

    newArray.push(div.outerHTML)
  })

  setCurrentText(newArray.join(''))
}

// function createNewSpan(uniqueSymbol: string, text: string) {
//   const span = document.createElement('span')
//   const textNode = document.createTextNode(
//     text
//     .replace(new RegExp('/^' + uniqueSymbol + '/'), '')
//     .replace(new RegExp('/' + uniqueSymbol + '$/'), ''))
//   span.appendChild(textNode)

//   return span
// }