export type Elements =
  | 'a' | 'abbr' | 'address' | 'area' | 'article' | 'aside'
  | 'audio' | 'b' | 'base' | 'bdo' | 'blockquote' | 'body'
  | 'br' | 'button' | 'canvas' | 'caption' | 'cite' | 'code'
  | 'col' | 'colgroup' | 'command' | 'datalist' | 'dd' | 'del'
  | 'details' | 'dfn  ' | 'dialog' | 'dir' | 'div' | 'dl'
  | 'dt' | 'em' | 'embed' | 'fieldset' | 'figcaption' | 'figure'
  | 'footer' | 'form' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'head' | 'header' | 'hgroup'
  | 'hr' | 'html' | 'i' | 'iframe' | 'img' | 'input' | 'ins'
  | 'kbd' | 'keygen' | 'label' | 'legend' | 'li' | 'link'
  | 'map' | 'mark' | 'menu' | 'meta' | 'meter' | 'nav'
  | 'noscript' | 'object' | 'ol' | 'optgroup' | 'option'
  | 'output' | 'p' | 'param' | 'pre' | 'progress' | 'q'
  | 'rp' | 'rt' | 'ruby' | 's' | 'samp' | 'script' | 'section'
  | 'select' | 'small' | 'source' | 'span' | 'strong'
  | 'style' | 'sub  ' | 'sup' | 'table' | 'tbody' | 'td'
  | 'tfoot' | 'th' | 'thead' | 'time' | 'title' | 'tr'
  | 'track' | 'u' | 'ul' | 'var' | 'video' | 'wbr'

export type ClassNames =
  | 'italic'
  | 'bold'
  | 'lineThrough'
  | 'underLine'
  | 'inlineCode'
  | 'horizontalBar'
  | 'space'
  | 'subscript'
  | 'superscript'

export type ContentReplacement = {
  shouldReplace: true
  regex: RegExp
} | {
  shouldReplace: false
}