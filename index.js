const PropTypes = require("prop-types")
const { createElement } = require("react")
const { parse } = require("node-html-parser")

const spaceSpan = `<span class="space">&nbsp;</span>`

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
      let inner = ""
      // script tags are skipped over
      if (tagName === "script") {
        inner = innerHTML
      } else {
        inner = reduceHTML(innerHTML)
      }

      const endTag = `</${tagName}>`

      return acc + startTag + inner + endTag
    } else {
      // else going through element that only has textcontent (rawText)
      const { rawText } = curr

      if (rawText === "&nbsp;") {
        // if space, print space span
        return acc + spaceSpan
      } else if (rawText === "\n") {
        // if linebreak, print line break
        return acc + rawText
      } else {
        // else we start to iterate textContent
        return rawText.split("").reduce((chars, char) => {
          if (char === " ") {
            // if space, print space span
            return chars + spaceSpan
          } else {
            // else wrap char around char span
            return chars + `<span class="char">${char}</span>`
          }
        }, "")
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
