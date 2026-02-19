1. Create HTML, add CSS classless stylesheet, all on the index.html file.
2. Prototype the UI for a bit, statically.
3. Optionally, add some extra CSS, if the components a special layout.
4. When I'm happy with how it looks, I can move it into individual web components.
5. Optionally, identify a "class" hierarchy for them.
6. Write lower level components on the page itself, replacing the static HTML with the dynamic component. In some cases, components can not even contain HTML! Sometimes, you can wrap your existing HTML in a custom component, adding JS interactivity to it. The browser will of course, render everything inside the component without issue!
   1. If the component really needs to "re-render" then either the HTML moves to a <template> at the bottom of the page, or certian parts of it go there.
7. Repeat, until the entire HTML is cleaned up appropriately.

## Note
1. These web components are light dom focused, as we are not concerned with CSS encapsulation. Until we really are.

## Snippets For Javascript
For useful macros for Vanilla JS web development, follow these steps in VS Code:
1. File -> Preferences -> Configure Snippets -> type "javascript" -> enter
2. VS code will open something like `/home/{USER}/.config/code/user/snippets/javascript.json`
3. Paste the contents below into it.
4. Have fun writing Vanilla JS lightning quick!

```json
{
	"Create Element": {
		"prefix": "ce",
		"body": "document.createElement('$1')$0",
		"description": "document.createElement"
	},
	"Query Selector": {
		"prefix": "qs",
		"body": "document.querySelector('$1')$0",
		"description": "document.querySelector"
	},
	"Create Element Variable": {
		"prefix": "cev",
		"body": "const \\$${1:item} = document.createElement('${2:div}')$0",
		"description": "const $el = document.createElement('tag')"
	},
	"Query Selector Variable": {
		"prefix": "qsv",
		"body": "const \\$${1:item} = document.querySelector('${2:.class}')$0",
		"description": "const $el = document.querySelector('selector')"
	},
	"Event Listener": {
		"prefix": "el",
		"body": "addEventListener('$1')$0",
		"description": "addEventListener"
	},
	"Clone Node": {
		"prefix": "cn",
		"body": "cloneNode(true)\n",
		"description": "cloneNode(true)"
	},
	"Clone Template": {
		"prefix": "ct",
		"body": "const ${1:template} = document.getElementById('${2:template}')\nconst \\$${1}  = ${1}.content.cloneNode(true).firstElementChild",
		"description": "Clone a <template> that exists in the HTML document"
	},
	"Web Component": {
		"prefix": "wc",
		"body": "class ${1:ComponentName} extends HTMLElement {\n\n\tconnectedCallback() {\n$0\n\t}\n}\n\ncustomElements.define('$2', $1)\n",
		"description": "Web Component JavaScript class declaration and 'definition'"
	}

	// Place your snippets for javascript here. Each snippet is defined under a snippet name and has a prefix, body and 
	// description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted. Possible variables are:
	// $1, $2 for tab stops, $0 for the final cursor position, and ${1:label}, ${2:another} for placeholders. Placeholders with the 
	// same ids are connected.
	// Example:
	// "Print to console": {
	// 	"prefix": "log",
	// 	"body": [
	// 		"console.log('$1');",
	// 		"$2"
	// 	],
	// 	"description": "Log output to console"
	// }
}
```