interface WorkerBaseData {
    messageId: string;
    functionName: string;
}
interface WorkerReceiveMessage extends WorkerBaseData {
    result: any;
    resultType: 'success' | 'error';
}
interface WorkerSendMessage extends WorkerBaseData {
    onResolve: ((...args: any[]) => any) | null;
    onReject: ((...args: any[]) => any) | null;
    args: any;
}
declare function workerToFunctions(workerText: string, addScripts?: {
    preText?: string;
    postText?: string;
    postWorker?: string;
}): any;
