export function parser(content: string, action?: 'POST-DB' | 'GET-DB') {
  const newContent = content

  if (action === 'POST-DB') {
    newContent
      .replace(new RegExp(/(<span\s+style="font-weight:\s*bold;">|<\/span>)/, 'g'), '*')
      .replace(new RegExp(/(<\/h1>|<\/h2>|<\/h3>|<\/h4>|<\/h5>|<\/h6>|)/), '')
  }

  if (action === 'GET-DB') {
    return newContent.split(' ')
  }
}