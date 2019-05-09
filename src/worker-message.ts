const ctx = self as any;
// const ctx = ({} || self);
// const ctx = self;

ctx.onmessage = async (e) => {
    const messageId = e.data.messageId;
    const functionName = e.data.functionName;
    let args: any[] = e.data.args;

    let result;
    let resultType;

    try {
        const functionHere = eval(`${functionName}`);
        result = functionHere(...args);
        resultType = 'success';
    } catch (err) {
        console.log(err);
        result = JSON.stringify(err);
        resultType = 'error';
    } finally {
        const data = {
            messageId: messageId,
            functionName: functionName,
            result: result,
            resultType: resultType
        };

        try {
            ctx.postMessage(JSON.parse(JSON.stringify(data)));
        } catch (err) {
            console.log(err);
        }
    }
}