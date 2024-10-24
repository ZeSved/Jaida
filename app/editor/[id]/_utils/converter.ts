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

// const matches = new Map([
//   ['**', `<span class='${style.bold}'>`]
// ])

class Convert {
  element: HTMLElement
  conversion: ClassNames

  constructor(conversion: ClassNames, elmType?: Elements) {
    this.element = document.createElement(elmType ?? 'span')
    this.conversion = conversion

    this.element.classList.add(style[conversion])
  }

  addText(text: string) {
    // const textValue = replace.shouldReplace === 'replace' ?
    //   text.replace(replace.startRegex, '').replace(replace.endRegex, '')
    //   : text
    // if (replace.shouldReplace === 'replace') {
    //   text.replace(replace.startRegex, '').replace(replace.endRegex, '')
    // }
    const textNode = document.createTextNode(
      // replace.shouldReplace ? text.replace(replace.regex, '') : 
      text
    )

    // textValue.split(' ').forEach(part => {
    //   const span = document.createElement('span')
    //   const textNode = document.createTextNode(part)
    //   span.appendChild(textNode)
    // })
    this.element.appendChild(textNode)

    return this
  }

  remove(regex: RegExp) {
    console.log(this.element.textContent)
    this.element.textContent = this.element.textContent!.replace(regex, '')
    console.log(this.element.textContent)

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

const c: { id: string, class: ClassNames, replace: boolean }[] = [
  {
    id: '\\*\\*',
    class: 'bold',
    replace: true
  },
  {
    id: '\\*',
    class: 'italic',
    replace: true
  },
  {
    id: '\\~\\~',
    class: 'lineThrough',
    replace: true
  },
  {
    id: '\\_',
    class: 'underLine',
    replace: true
  },
  {
    id: '\\`',
    class: 'inlineCode',
    replace: true
  },
]

// const conversions = [
//   {
//     condition: (text: string) => { return /^\*\*(?:\s|[^**])+\*\*$/.test(text) },
//     function: (text: string) => {
//       const elmList: HTMLElement[] = []
//       if (text.includes(' ')) {
//         text.split(' ').forEach((part, i) => {
//           if (i === 0) {
//             const span = new Convert('bold')
//               .addSideDecoration('**')
//               .addText(part, { shouldReplace: 'replace', startRegex: /^\*\*/, endRegex: /\*\*$/ })
//           }
//         })
//       }
//       const elm = new Convert('bold')
//         .addSideDecoration('**')
//         .addText(text, { shouldReplace: 'replace', endRegex: /\*\*$/, startRegex: /^\*\*/ })
//         .addSideDecoration('**').element

//       return elmList
//     }
//   },
//   {
//     condition: (text: string) => { return /^\*(?:\s|[^*])+\*$/.test(text) },
//     function: (text: string) => {
//       const elm = new Convert('italic')
//         .addSideDecoration('*')
//         .addText(text, { shouldReplace: 'replace', startRegex: /^\*/, endRegex: /\*$/ })
//         .addSideDecoration('*').element

//       return elm
//     }
//   },
//   {
//     condition: (text: string) => { return /^\~\~(?:\s|[^~~])+\~\~$/.test(text) },
//     function: (text: string) => {
//       const elm = new Convert('lineThrough')
//         .addSideDecoration('~~')
//         .addText(text, { shouldReplace: 'replace', startRegex: /^\~\~/, endRegex: /\~\~$/ })
//         .addSideDecoration('~~').element

//       return elm
//     }
//   },
//   {
//     condition: (text: string) => { return /^\_(?:\s|[^_])+\_$/.test(text) },
//     function: (text: string) => {
//       const elm = new Convert('underLine')
//         .addSideDecoration('_')
//         .addText(text, { shouldReplace: 'replace', startRegex: /^\_/, endRegex: /\_$/ })
//         .addSideDecoration('_').element

//       return elm
//     }
//   },
//   {
//     condition: (text: string) => { return /^\`(?:\s|[^`])+\`$/.test(text) },
//     function: (text: string) => {
//       const elm = new Convert('inlineCode')
//         .addSideDecoration('`')
//         .addText(text, { shouldReplace: 'replace', startRegex: /^\`/, endRegex: /\`$/ })
//         .addSideDecoration('`').element

//       return elm
//     }
//   },
//   {
//     condition: (text: string) => { return /^\-\-\-$/.test(text) },
//     function: (text: string) => {
//       const elm = new Convert('horizontalBar', 'hr')
//         .addText(text, { shouldReplace: 'no-replace' })
//         .element

//       return elm
//     }
//   },
//   {
//     // condition: (text: string) => { return /^[^*#>]*$/.test(text) },
//     condition: (text: string) => { return true },
//     function: (text: string) => {
//       const span = document.createElement('span')
//       span.appendChild(document.createTextNode(text))

//       // return span.outerHTML
//       return span
//     }
//   },
// ]

export function converter(text: string, setCurrentText: Dispatch<SetStateAction<string>>) {
  // const textArray = text.match(/\w+|\s+/g)
  const textArray = text.match(/\S+|\s+/g)
  const e = text.split(/\r\n|\r|\n/)
  console.log(encodeURI(text))
  // console.log(e)
  // console.log(text)
  const newArray: string[] = []

  e.forEach(el => {
    const div = document.createElement('div')
    // let te = ''
    // console.log(el)

    if (el === '') {
      const div = document.createElement('div')
      div.className = style.emptyRow
      div.textContent = 'n'
      newArray.push(div.outerHTML)
    }


    console.log(8, el.match(/(\_(?:\s|[^_])+\_|\~\~(?:\s|[^~])+\~\~|\*(?:\s|[^*])+\*|\*\*(?:\s|[^**])+\*\*)|\S+|\s+|\%\0\A/g))
    // el.split(' ')?.forEach(t => {
    el.match(/(\_(?:\s|[^_])+\_|\~\~(?:\s|[^~])+\~\~|\*(?:\s|[^*])+\*|\*\*(?:\s|[^**])+\*\*)|\S+|\s+|\%\0\A/g)?.forEach(t => {
      console.log(t)
      if (t.startsWith(' ')) {
        const tArr = t.split('')
        tArr.forEach(s => {
          const span = document.createElement('span')
          span.className = style.space
          newArray.push(span.outerHTML)
          // div.appendChild(span)
          // newArray.push(span.outerHTML)
        })
      }

      for (const { class: className, id, replace } of c) {
        if (new RegExp(`${id}(?:\s|[^${id.replace(/\\/g, '')}])+${id}`).test(t) && t.includes(' ')) {
          const textArr = t.split(' ')
          textArr.forEach(te => {
            if (replace && new RegExp(`^${id}`).test(te)) {
              const elm = new Convert(className)
                .addSideDecoration(id.replace(/\\/g, ''))
                .addText(te.replace(new RegExp(`^${id}`), ''))
                .element.outerHTML

              newArray.push(
                elm
              )

              newArray.push(
                new Convert('space')
                  .element.outerHTML
              )

              return
            } else if (replace && new RegExp(`${id}$`).test(te)) {
              const elm = new Convert(className)
                .addText(te.replace(new RegExp(`${id}$`), ''))
                .addSideDecoration(id.replace(/\\/g, ''))
                .element.outerHTML

              newArray.push(
                elm
              )

              return
            } else {
              const elm = new Convert(className)
                .addText(te)
                .element.outerHTML

              console.log(elm)

              newArray.push(
                elm
              )

              newArray.push(
                new Convert('space')
                  .element.outerHTML
              )
              return
            }
          })
          return
        } else if (new RegExp(`${id}(?:\s|[^${id.replace(/\\/g, '')}])+${id}`).test(t) && !t.includes(' ')) {
          const elm = new Convert(className)
            .addSideDecoration(id.replace(/\\/g, ''))
            .addText(t.replaceAll(new RegExp(`${id}`, 'g'), ''))
            .addSideDecoration(id.replace(/\\/g, ''))
            .element.outerHTML

          newArray.push(
            elm
          )

          return
        }
      }

      if (t === '---') {
        const elm = new Convert('horizontalBar').element
        const hr = document.createElement('hr')
        elm.appendChild(hr)

        newArray.push(elm.outerHTML)
      } else if (t === '%0A') {
        const span = document.createElement('span')
        span.className = style.newRow
        newArray.push(span.outerHTML)
      } else {
        const span = document.createElement('span')
        span.appendChild(document.createTextNode(t))
        newArray.push(span.outerHTML)
      }
    })

    // newArray.push(div.outerHTML)

  })

  setCurrentText(newArray.join(''))
}