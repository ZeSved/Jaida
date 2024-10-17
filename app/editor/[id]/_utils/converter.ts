import style from '../m-d-editor.module.scss'
import { Dispatch, SetStateAction } from "react"
import { ClassNames, Elements } from './elementTypes'

// const matches = new Map([
//   ['bold', new RegExp(/^\*\*\S+\*\*$/)],
//   ['italic', new RegExp(/^\*\S+\*$/)],
//   ['lineThrough', new RegExp(/^\~\~\S+\~\~$/)],
//   ['emptyRow', new RegExp(/^$/)],
//   ['space', new RegExp(/^\s$/)],
// ])

// const replacements = new Map([
//   ['bold', [new RegExp(/^\*\*/), new RegExp(/\*\*$/), '**']],
//   ['italic', [new RegExp(/^\*/), new RegExp(/\*$/), '*']],
//   ['lineThrough', [new RegExp(/^\~\~/), new RegExp(/\~\~$/), '~~']],
// ])

const conver = [
  {
    type: 'bold',
    match: new RegExp(/^\*\*\S+\*\*$/),
    shouldBeReplaced: true,
    startReplace: new RegExp(/^\*\*/),
    endReplace: new RegExp(/\*\*$/),
    spanInserts: '**'
  },
  {
    type: 'italic',
    match: new RegExp(/^\*\S+\*$/),
    shouldBeReplaced: true,
    startReplace: new RegExp(/^\*/),
    endReplace: new RegExp(/\*$/),
    spanInserts: '*'
  },
  {
    type: 'lineThrough',
    match: new RegExp(/^\~\~\S+\~\~$/),
    shouldBeReplaced: true,
    startReplace: new RegExp(/^\~\~/),
    endReplace: new RegExp(/\~\~$/),
    spanInserts: '~~'
  },
  {
    type: 'underLine',
    match: new RegExp(/^\_\S+\_$/),
    shouldBeReplaced: true,
    startReplace: new RegExp(/^\_/),
    endReplace: new RegExp(/\_$/),
    spanInserts: '_'
  },
  {
    type: 'overLine',
    match: new RegExp(/^\¨\S+\¨$/),
    shouldBeReplaced: true,
    startReplace: new RegExp(/^\¨/),
    endReplace: new RegExp(/\¨$/),
    spanInserts: '¨'
  },
]

// class Convert {
//   elements: HTMLElement[]
//   conversion: ClassNames

//   constructor(elmType: Elements, conversion: ClassNames) {
//     this.elements = [document.createElement(elmType)]
//     this.conversion = conversion

//     this.elements[0].classList.add(style[this.conversion])
//   }

//   // assignClass(name: ClassNames) {
//   //   this.element.classList.add(style[name])
//   //   return this
//   // }

//   addText(text: string) {
//     if (this.conversion === 'bold' || this.conversion === 'italic' || this.conversion === 'lineThrough') {
//       const [startReplace, endReplace, insert] = replacements.get(this.conversion)!
//       text.replace(startReplace, '').replace(endReplace, '')
//       const textNode = document.createTextNode(text)
//       const spans = [document.createElement('span'), document.createElement('span')]

//       spans.forEach(span => {
//         const textNode = document.createTextNode((insert as string))

//         span.style.opacity = '0.5'
//         span.appendChild(textNode)
//       })

//       this.elements.push(spans[0])
//       this.elements.unshift(spans[1])

//       this.elements[1].appendChild(textNode)
//     } else {
//       const textNode = document.createTextNode(text)
//       this.elements[0].appendChild(textNode)
//     }

//     return this
//   }
// }

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
      const edgeSpan1 = document.createElement('span')
      const edgeSpan2 = document.createElement('span')

      edgeSpan1.appendChild(document.createTextNode('*'))
      edgeSpan2.appendChild(document.createTextNode('*'))

      edgeSpan1.style.opacity = '0.5'
      edgeSpan2.style.opacity = '0.5'

      span.style.fontStyle = 'italic'
      span.appendChild(edgeSpan1)
      span.appendChild(document.createTextNode(text.replace(/^\*/, '').replace(/\*$/, '')))
      span.appendChild(edgeSpan2)
      span.classList.add(style.italic)
      // span.textContent = `${edgeSpan1}${span.textContent}${edgeSpan2}`

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

      // for (const convert of conversions) {
      //   if (convert.condition(t)) {
      //     // newArray.push(convert.function(t))
      //     div.appendChild(convert.function(t))

      //     break
      //   }
      // }
      t.split(' ').forEach(r => {
        for (const convert of conver) {
          console.log(convert.match.test(r))
          console.log(r)
          if (convert.match.test(r)) {
            const span = document.createElement('span')
            const span1 = document.createElement('span')
            const span2 = document.createElement('span')

            span1.textContent = convert.spanInserts
            span2.textContent = convert.spanInserts

            span1.style.opacity = '0.5'
            span2.style.opacity = '0.5'

            span.appendChild(span1)
            span.appendChild(document.createTextNode(r.replace(convert.startReplace, '').replace(convert.endReplace, '')))
            span.appendChild(span2)
            span.classList.add(style[convert.type])
            // newArray.push(convert.function(t))
            div.appendChild(span)

            break
          } else if (!/^(\¨\S+\¨|\_\S+\_|\~\~\S+\~\~|\*\S+\*|\*\*\S+\*\*)*$/.test(r)) {
            const span = document.createElement('span')
            span.appendChild(document.createTextNode(r))
            div.appendChild(span)

            break
          }
        }
      })
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