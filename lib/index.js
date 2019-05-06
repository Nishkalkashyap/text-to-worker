"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function textToWorker(workerText, addScripts) {
    addScripts = addScripts || {};
    let newWorkerText = String().concat(addScripts.preText || '', workerText, addScripts.postText || '', `
        self.onmessage = async (e) => {
            const messageId = e.data.messageId;
            const functionName = e.data.functionName;
            let args = e.data.args;
        
            let result;
            let resultType;
        
            try {
                result = await eval(\`\${functionName}(\${args})\`);
                resultType = 'success';
            } catch (err) {
                console.log(err);
                result = JSON.stringify(err);
                resultType = 'error';
            } finally {
                const data = {
                    messageId : messageId,
                    functionName : functionName,
                    result : result,
                    resultType : resultType
                };
                
            try {
                global.postMessage(JSON.parse(JSON.stringify(data)));
            }catch(err){
                console.log(err);
            }


            }
        }
        `, addScripts.postWorker || '');
    const worker = new Worker(URL.createObjectURL(new Blob([workerText.concat(newWorkerText)])));
    const calledFunctions = [];
    worker.onmessage = (e) => {
        let message = (e.data);
        const find = calledFunctions.find((val) => {
            return val.messageId == message.messageId;
        });
        if (find && find.onReject && find.onResolve) {
            if (message.resultType == 'success') {
                find.onResolve(...message.result);
                return;
            }
            find.onReject(message.result);
        }
    };
    const proxy = new Proxy({}, {
        get: (t, p, r) => {
            const messageId = (Math.random() + Date.now()).toString();
            const func = {
                messageId: messageId,
                functionName: p,
                onResolve: null,
                onReject: null,
                args: null
            };
            calledFunctions.push(func);
            return (...args) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    func.args = args;
                    worker.postMessage(func);
                    func.onResolve = resolve;
                    func.onReject = reject;
                });
            });
        }
    });
    return proxy;
}
exports.textToWorker = textToWorker;
//# sourceMappingURL=index.js.map