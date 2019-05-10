export declare function textToWorker(workerText: string, addScripts?: {
    preText?: string;
    postText?: string;
    postWorker?: string;
    type?: 'classic' | 'module';
}): any;
