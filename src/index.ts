
interface WorkerBaseData {
    messageId: string;
    functionName: string;
}

interface WorkerReceiveMessage extends WorkerBaseData {
    result: any;
    resultType: 'success' | 'error'
}

interface WorkerSendMessage extends WorkerBaseData {
    onResolve: ((...args: any[]) => any) | null;
    onReject: ((...args: any[]) => any) | null;
    args: any;
}

export function textToWorker(workerText: string, addScripts?: {
    preText?: string;
    postText?: string;
    postWorker?: string
}) {
    // const worker: Worker = new Worker(URL.createObjectURL(new Blob(['(' + workerText + ')()'])));
    addScripts = addScripts || {};
    let newWorkerText = String().concat(
        addScripts.preText || '',
        workerText,
        addScripts.postText || '',
        `
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
        `,
        addScripts.postWorker || ''
    )

    const worker: Worker = new Worker(URL.createObjectURL(new Blob([workerText.concat(newWorkerText)])));
    const calledFunctions: WorkerSendMessage[] = [];

    worker.onmessage = (e) => {
        let message: WorkerReceiveMessage = (e.data);
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

    const proxy = new Proxy({} as any, {
        get: (t, p, r) => {
            const messageId = (Math.random() + Date.now()).toString();
            const func: WorkerSendMessage = {
                messageId: messageId,
                functionName: p as any,
                onResolve: null,
                onReject: null,
                args: null
            }

            calledFunctions.push(func);

            return async (...args: any[]) => {
                return new Promise((resolve, reject) => {
                    func.args = args;

                    worker.postMessage(func);

                    func.onResolve = resolve;
                    func.onReject = reject;
                });
            }
        }
    });

    return proxy;
}