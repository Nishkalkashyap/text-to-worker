import text from '!!raw-loader!ts-loader!./worker-message.ts';

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

    addScripts = addScripts || {};
    let newWorkerText = String().concat(
        addScripts.preText || '',
        workerText,
        addScripts.postText || '',
        ';',
        text,
        ';',
        addScripts.postWorker || ''
    )

    const worker: Worker = new Worker(URL.createObjectURL(new Blob([newWorkerText])));
    const calledFunctions: WorkerSendMessage[] = [];

    worker.onmessage = (e) => {
        let message: WorkerReceiveMessage = (e.data);
        let index: number;
        const find = calledFunctions.find((val, _index) => {
            index = _index;
            return val.messageId == message.messageId;
        });

        if (find && find.onReject && find.onResolve) {
            calledFunctions.splice(index, 1);
            if (message.resultType == 'success') {
                find.onResolve(message.result);
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