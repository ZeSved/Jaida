export function parser(action: 'HTML-MD' | 'MD-HTML', content: string) {
  const newContent = content

  if (action === 'HTML-MD') {
    newContent
      .replace(new RegExp(/(<span\s+style="font-weight:\s*bold;">|<\/span>)/, 'g'), '*')
      .replace(new RegExp(/(<\/h1>|<\/h2>|<\/h3>|<\/h4>|<\/h5>|<\/h6>|)/), '')
  }

  if (action === 'MD-HTML') {
    return newContent.split(' ')
  }
}