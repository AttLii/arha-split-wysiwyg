const PropTypes = require("prop-types")
const { createElement } = require("react")
const { parse } = require("node-html-parser")

const spaceSpan =
  '<span class="space" style="display:inline-block">&nbsp;</span>'

const reduceChars = (chars, char) => {
  return chars + `<span class="char">${char}</span>`
}

const reduceWords = (words, word) => {
  const charSpans = word.split("").reduce(reduceChars, "")
  return (
    words +
    `<span class="word" style="display:inline-flex">${charSpans}${spaceSpan}</span>`
  )
}

const reduceHTML = string => {
  // parse html string with a library
  // get array of childnodes
  const nodes = parse(string).childNodes

  // iterate nodes
  return nodes.reduce((acc, curr) => {
    const { tagName } = curr

    // if node has a tagname, f.e. p or ul
    if (tagName) {
      // create wrapping element with it's type and attributes and call this function again
      const { innerHTML, rawAttrs } = curr

      const startTag = `<${tagName} ${rawAttrs}>`
      const endTag = `</${tagName}>`
      let inner = ""
      // script tags are skipped over
      if (tagName === "script") {
        inner = innerHTML
      } else {
        inner = reduceHTML(innerHTML)
      }

      return acc + startTag + inner + endTag
    } else {
      // else going through element that only has textcontent (rawText)
      const { rawText } = curr

      if (rawText === "&nbsp;") {
        return acc + spaceSpan
      } else if (rawText === "\n") {
        return acc + rawText
      } else {
        return acc + rawText.split(" ").reduce(reduceWords, "")
      }
    }
  }, "")
}

const SplitWysiwyg = props => {
  const { className, children } = props

  return createElement(
    "div",
    {
      className,
      dangerouslySetInnerHTML: {
        __html: reduceHTML(children)
      }
    },
    null
  )
}

SplitWysiwyg.defaultProps = {
  className: "",
  children: ""
}

SplitWysiwyg.propTypes = {
  className: PropTypes.string,
  children: PropTypes.string
}

module.exports = SplitWysiwyg
