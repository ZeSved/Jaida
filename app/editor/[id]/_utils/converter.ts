import style from '../m-d-editor.module.scss'
import { Dispatch, SetStateAction } from "react"
import { ClassNames, ContentReplacement, Elements } from './elementTypes'

const locatedTokens = {
  bold: 0,
  italic: 0,
  underLine: 0,
  lineThrough: 0,
  inlineCode: 0,
}

class Convert {
  element: HTMLElement
  conversion: ClassNames

  constructor(conversion: ClassNames, elmType?: Elements) {
    this.element = document.createElement(elmType ?? 'span')
    this.conversion = conversion

    this.element.classList.add(style[this.conversion])
  }

  addText(text: string, replace: ContentReplacement) {
    const textNode = document.createTextNode(
      replace.shouldReplace === 'replace' ?
        text.replace(replace.startRegex, '').replace(replace.endRegex, '')
        : text
    )

    this.element.appendChild(textNode)

    return this
  }

  addSideDecoration(text: string) {
    const span = document.createElement('span')
    const textNode = document.createTextNode(text)

    span.style.opacity = '0.5'
    span.appendChild(textNode)

    this.element.appendChild(span)

    return this
  }
}

const conversions = [
  {
    condition: (text: string) => { return /^\*\*\S+\*\*$/.test(text) },
    function: (text: string) => {
      const elm = new Convert('bold')
        .addSideDecoration('**')
        .addText(text, { shouldReplace: 'replace', endRegex: /\*\*$/, startRegex: /^\*\*/ })
        .addSideDecoration('**').element

      return elm
    }
  },
  {
    condition: (text: string) => { return /^\*\S+\*$/.test(text) },
    function: (text: string) => {
      const elm = new Convert('italic')
        .addSideDecoration('*')
        .addText(text, { shouldReplace: 'replace', startRegex: /^\*/, endRegex: /\*$/ })
        .addSideDecoration('*').element

      return elm
    }
  },
  {
    condition: (text: string) => { return /^\~\~\S+\~\~$/.test(text) },
    function: (text: string) => {
      const elm = new Convert('lineThrough')
        .addSideDecoration('~~')
        .addText(text, { shouldReplace: 'replace', startRegex: /^\~\~/, endRegex: /\~\~$/ })
        .addSideDecoration('~~').element

      return elm
    }
  },
  {
    condition: (text: string) => { return /^\_\S+\_$/.test(text) },
    function: (text: string) => {
      const elm = new Convert('underLine')
        .addSideDecoration('_')
        .addText(text, { shouldReplace: 'replace', startRegex: /^\_/, endRegex: /\_$/ })
        .addSideDecoration('_').element

      return elm
    }
  },
  {
    condition: (text: string) => { return /^\`\S+\`$/.test(text) },
    function: (text: string) => {
      const elm = new Convert('inlineCode')
        .addSideDecoration('`')
        .addText(text, { shouldReplace: 'replace', startRegex: /^\`/, endRegex: /\`$/ })
        .addSideDecoration('`').element

      return elm
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
      // t.split(' ').forEach(r => {
      //   for (const convert of conver) {
      //     console.log(convert.match.test(r))
      //     console.log(r)
      //     if (convert.match.test(r)) {
      //       const span = document.createElement('span')
      //       const span1 = document.createElement('span')
      //       const span2 = document.createElement('span')

      //       span1.textContent = convert.spanInserts
      //       span2.textContent = convert.spanInserts

      //       span1.style.opacity = '0.5'
      //       span2.style.opacity = '0.5'

      //       span.appendChild(span1)
      //       span.appendChild(document.createTextNode(r.replace(convert.startReplace, '').replace(convert.endReplace, '')))
      //       span.appendChild(span2)
      //       span.classList.add(style[convert.type])
      //       // newArray.push(convert.function(t))
      //       div.appendChild(span)

      //       break
      //     } else if (!/^(\¨\S+\¨|\_\S+\_|\~\~\S+\~\~|\*\S+\*|\*\*\S+\*\*)*$/.test(r)) {
      //       const span = document.createElement('span')
      //       span.appendChild(document.createTextNode(r))
      //       div.appendChild(span)

      //       break
      //     }
      //   }
      // })
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