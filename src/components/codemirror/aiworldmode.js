import CodeMirror from 'codemirror'
import 'codemirror/addon/mode/simple'

CodeMirror.defineSimpleMode('aiworld', {
  // The start state contains the rules that are intially used
  start: [
    // The regex matches the token, the token property contains the type
    {
      regex: /'(?:[^\\]|\\.)*?(?:'|$)/,
      token: 'string'
    },
    // You can match multiple tokens at once. Note that the captured
    // groups must span the whole string in this case
    {
      regex: /([a-z$][\w$]*)(\s*\()/,
      token: ['function', null]
    },
    {
      regex: /(jump)(\s+)([a-zA-Z]+\w*)/,
      token: ['keyword', null, 'bracket']
    },
    // Rules are matched in the order in which they appear, so there is
    // no ambiguity between this one and the one above
    {
      regex: /(?:if|else|endif|jump)\b/,
      token: 'keyword'
    },
    {
      regex: /(?:n|e|s|w|ne|se|sw|nw|here|floor|wall|hole|hero|objective)\b/,
      token: 'atom'
    },
    {
      regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i,
      token: 'number'
    },
    {
      regex: /\/\/.*/,
      token: 'comment'
    },
    {
      regex: /[a-zA-Z]+\w*\s*:/,
      token: 'bracket'
    },
    {
      regex: /\/(?:[^\\]|\\.)*?\//,
      token: 'variable-3'
    },
    // A next property will cause the mode to move to a different state
    {
      regex: /\/\*/,
      token: 'comment',
      next: 'comment'
    },
    {
      regex: /[-+\/*=<>!]+|&&|\|\|/,
      token: 'operator'
    },
    // indent and dedent properties guide autoindentation
    {
      regex: /[\{\[\(]/,
      indent: true
    },
    {
      regex: /[\}\]\)]/,
      dedent: true
    },
    {
      regex: /[a-z$][\w$]*/,
      token: 'variable'
    },
    // You can embed other modes with the mode property. This rule
    // causes all code between << and >> to be highlighted with the XML
    // mode.
    {
      regex: /<</,
      token: 'meta',
      mode: {
        spec: 'xml',
        end: />>/
      }
    }
  ],
  // The multi-line comment state.
  comment: [{
      regex: /.*?\*\//,
      token: 'comment',
      next: 'start'
    },
    {
      regex: /.*/,
      token: 'comment'
    }
  ],
  // The meta property contains global information about the mode. It
  // can contain properties like lineComment, which are supported by
  // all modes, and also directives like dontIndentStates, which are
  // specific to simple modes.
  meta: {
    dontIndentStates: ['comment'],
    lineComment: '//'
  }
})