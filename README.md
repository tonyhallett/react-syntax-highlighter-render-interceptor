# What is it ?

This is a custom renderer for [react-syntax-highlighter](https://www.npmjs.com/package/react-syntax-highlighter).

It is a slight modification of the default renderer with hooks for changing the default behaviour.


# Why ?

The default renderer works fine in conjunction with the style prop and if custom behaviour is required it
is likely that you would re-implement a large part of the default behaviour.

The hooks allow behaviour to be modified whilst retaining the parent/child rendering of React.createElement.

# How it works without the hooks

react-syntax-highlighter will call through to a [ast parser](https://github.com/conorhastings/react-syntax-highlighter/blob/83ef077a77123bff0d46bb42d515a7d60d46fbff/src/highlight.js#L164) and return a root array of nodes.  
These nodes are either element nodes or text nodes.
The type property determines the type of node.  
Element nodes are the most important as these will be rendered by React.createElement, the type determined by the tagName property.
Text nodes are rendered as strings from the value property.

```typescript
type RenderNode = ElementNode | TextNode;
interface ElementNode{
  type:'element',
  tagName:any,
  properties:{
    className:Array<string>,
    style?:React.CSSProperties,
    [index: string]: unknown
  },
  children: Array<RenderNode>,
  [index:string]:any
}
interface TextNode{
  type:'text',
  value:string,
  [index: string]: unknown
}
```
react-syntax-highlighter will [call the renderer](https://github.com/conorhastings/react-syntax-highlighter/blob/83ef077a77123bff0d46bb42d515a7d60d46fbff/src/highlight.js#L259) with these nodes and the stylesheet from the style prop and also the useInlineStyles prop value.

```typescript
interface CustomRenderer{
  (details:CustomRendererDetails): React.ReactNode[]
} 

interface CustomRendererDetails{
  rows:Array<RenderNode>, 
  stylesheet:Stylesheet, 
  useInlineStyles:boolean
}

interface Stylesheet{
  [key:string]:React.CSSProperties
}
```

The default renderer works by recursively creating react elements based upon the node, stylesheet and useInlineStyle.  As such these properties become NodeRenderDetails, with the addition of a generated key.

The generated key is of the form code-segment-..... 

The root keys are:

code-segment-0

code-segment-1 etc

Each child then appends -n to that of its parent.

e.g
* code-segment-0
  * code-segment-0-0
  * code-segment-0-1
* code-segment-1
  * code-segment-1-0
  * code-segment-1-1
    * code-segment-1-1-0

```typescript
interface NodeRenderDetails{
  key:string,
  node:RenderNode,
  stylesheet:Stylesheet,
  useInlineStyles:boolean
}
```
It is this type that will be passed to the interceptor.

## The element that is created
Element nodes -> React.createElement(node.tagName,...)

Text nodes -> node.value

So given the following node :

```typescript
{
  type:'element',
  tagName:'span',
  children:[
    {
      type:'text',
      value:'Some value'
    }
  ]
  /* omitting other properties*/
}

```
A span will be created
```typescript
<span>Some value</span>
```
## styles
Styles are applied diffently depending upon the useInlineStyles prop.

### useInlineStyles false
**No styles are applied** but className is applied - the classes taken from 
```typescript
ElementNode.properties.className
```
For example, a comment will with Prism be an element node ( tagName span ) with className 
```typescript
['token', 'comment']
```
To style this without inline styles you would need to add a stylesheet with a selector targeting these classes.

### useInlineStyles true
The created react element will have a styles prop.  The style will be a merge of 
1. node.properties.style **only through hooks, ast does not provide style ( well I do not think so !)**
2. entries from the styles prop for each ElementNode.properties.className

Note that any ElementNode.properties.className not in the stylesheet keys will be applied to the created element.

# How it differs from the default ( aside from the hooks )

It allows for props.children to be used instead of ElementNode.children.
The key shows the nesting level.

# The hooks

There are two hooks styleCreator and interceptor.  

```typescript
interface StyleCreator{
  (currentStyle:React.CSSProperties, classNames:string[],node:ElementNode):React.CSSProperties|undefined
}
interface NodeRenderInterceptor{
  (nodeRenderDetails:NodeRenderDetails):NodeRenderDetails|undefined
}
function createCustomRenderer(
  styleCreator:StyleCreator = (style) => style,
  interceptor:NodeRenderInterceptor = (d)=>d):CustomRenderer

```
## Style creator
The style creator **only gets called when the useInlineStyles prop is true ( the default)**.

This function allows changing the style that would be applied to the created element, as described above.

If the style creator does not apply to the node then returning undefined will apply the style as normal.

( You would probably use the classNames to determine if the style creator should be applied. )

## Node interceptor
The interceptor will get called for every node and has much more control.

If the interceptor returns null/undefined then that node will not be rendered.

The interceptor can change the node to alter the element type being rendered, the text that will be displayed or
completely altering the structure of the node.

The interceptor ( and the style creator ) **can add props** to ElementNode.properties

The interceptor can also change the values of the style prop which would affect the current and all further nodes.  It could also return a different stylesheet or change useInlineStyles which would apply to the current node and all descendants.

# Chaining

There are two helper functions so that can supply multiple style creators or multiple interceptors each with their own responsibilities.

```typescript
function createChainedStyleCreator(...styleCreators:Array<StyleCreator|undefined>):StyleCreator
function createChainedNodeRenderInterceptor(...nodeRenderInterceptors:Array<NodeRenderInterceptor|undefined>):NodeRenderInterceptor
```

All chained style creators are called.  The style passed will be the merged style for the first and for subsequent will be the style returned from the previous style creator.  If a style creator returns undefined/null the last defined style will be passed to the next in the chain.

Chained node render interceptors works similarly except when undefined/null is returned no further interceptors will be called and the node will not be rendered.

# Use cases

This renderer is used by [react-syntax-highlighter-comments](https://www.npmjs.com/package/react-syntax-highlighter-comments)


The style creators and interceptors interpret in comment instructions to facilitate:

* Non rendering of a comment.
* Colouring comments in multiple ways
  * Triple *** - red comment
  * hsl/a 
  * rgb/a
  * hex 
* Generic styling - specifying style object inline.
* Attaching an object property to a node ( to be used by other interceptors)
  this enables reference styling where a style ( class ) lookup can be defined once 
  and a comment can reference the styles that should be applied.
* Attaching class names - to be used with the style prop
* Splitting the comment into parts - so can apply different styles to different text
* Changing the tagName and specifying props
* Markdown style link creation.

These 'interceptors' also work with live editing - see the [demo](https://tonyhallett.github.io/react-syntax-highlighter-comments) 




