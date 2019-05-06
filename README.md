# text-to-worker

> Moves a module into a Web Worker, automatically reflecting exported functions as asynchronous proxies.

## Install

```sh
npm install --save text-to-worker
```


**worker.js**:
```js
let worker = textToWorker(`
	function sum(a, b) {
        return a + b;
    }
`);

(async () => {
    const result = await worker.sum(1, 2);
    console.log(result);//prints 3;
})();
```


### License

[MIT License](https://oss.ninja/mit/developit/) © [Nishkal Kashyap](https://nishkal.in)