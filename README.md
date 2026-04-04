## How To Run
1. Open index.html with VS Code LiveView, or try:
2. node
```shell
npm install -g http-server
http-server -p 8080
```
To prevent service worker cache during development, in devtools, do the following:

- "Update on Reload" (DevTools): In Chrome/Edge, go to Application > Service Workers and check Update on reload. This forces the browser to fetch the new SW script on every refresh.
- In the Application tab, check Bypass for network. This essentially "turns off" the SW's fetch interception, letting you debug your UI without cache interference.
