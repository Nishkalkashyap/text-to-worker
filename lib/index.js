var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function workerToFunctions(workerText, addScripts) {
    var _this = this;
    // const worker: Worker = new Worker(URL.createObjectURL(new Blob(['(' + workerText + ')()'])));
    addScripts = addScripts || {};
    var newWorkerText = String().concat(addScripts.preText || '', workerText, addScripts.postText || '', "\n        self.onmessage = async (e) => {\n            const messageId = e.data.messageId;\n            const functionName = e.data.functionName;\n            let args = e.data.args;\n        \n            let result;\n            let resultType;\n        \n            try {\n                result = await eval(`${functionName}(${args})`);\n                resultType = 'success';\n            } catch (err) {\n                result = err;\n                resultType = 'error';\n            } finally {\n                const data = {\n                    messageId : messageId,\n                    functionName : functionName,\n                    result : result,\n                    resultType : resultType\n                };\n                // console.log(data);\n                global.postMessage(data);\n            }\n        }\n        ", addScripts.postWorker || '');
    var worker = new Worker(URL.createObjectURL(new Blob([workerText.concat(newWorkerText)])));
    var calledFunctions = [];
    worker.onmessage = function (e) {
        var message = e.data;
        var find = calledFunctions.find(function (val) {
            return val.messageId == message.messageId;
        });
        if (find && find.onReject && find.onResolve) {
            if (message.resultType == 'success') {
                find.onResolve.apply(find, message.result);
                return;
            }
            find.onReject.apply(find, message.result);
        }
    };
    var proxy = new Proxy({}, {
        get: function (t, p, r) {
            var messageId = (Math.random() + Date.now()).toString();
            var func = {
                messageId: messageId,
                functionName: p,
                onResolve: null,
                onReject: null,
                args: null
            };
            calledFunctions.push(func);
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                func.args = args;
                                worker.postMessage(func);
                                func.onResolve = resolve;
                                func.onReject = reject;
                            })];
                    });
                });
            };
        }
    });
    return proxy;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsU0FBUyxpQkFBaUIsQ0FBQyxVQUFrQixFQUFFLFVBSTlDO0lBSkQsaUJBc0ZDO0lBakZHLGdHQUFnRztJQUNoRyxVQUFVLEdBQUcsVUFBVSxJQUFJLEVBQUUsQ0FBQztJQUM5QixJQUFJLGFBQWEsR0FBRyxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQy9CLFVBQVUsQ0FBQyxPQUFPLElBQUksRUFBRSxFQUN4QixVQUFVLEVBQ1YsVUFBVSxDQUFDLFFBQVEsSUFBSSxFQUFFLEVBQ3pCLHUxQkEwQkMsRUFDRCxVQUFVLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FDOUIsQ0FBQTtJQUVELElBQU0sTUFBTSxHQUFXLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckcsSUFBTSxlQUFlLEdBQXdCLEVBQUUsQ0FBQztJQUVoRCxNQUFNLENBQUMsU0FBUyxHQUFHLFVBQUMsQ0FBQztRQUNqQixJQUFJLE9BQU8sR0FBeUIsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUMzQyxJQUFNLElBQUksR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLFVBQUMsR0FBRztZQUNsQyxPQUFPLEdBQUcsQ0FBQyxTQUFTLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQztRQUM5QyxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUN6QyxJQUFJLE9BQU8sQ0FBQyxVQUFVLElBQUksU0FBUyxFQUFFO2dCQUNqQyxJQUFJLENBQUMsU0FBUyxPQUFkLElBQUksRUFBYyxPQUFPLENBQUMsTUFBTSxFQUFFO2dCQUNsQyxPQUFPO2FBQ1Y7WUFDRCxJQUFJLENBQUMsUUFBUSxPQUFiLElBQUksRUFBYSxPQUFPLENBQUMsTUFBTSxFQUFFO1NBQ3BDO0lBQ0wsQ0FBQyxDQUFDO0lBRUYsSUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsRUFBUyxFQUFFO1FBQy9CLEdBQUcsRUFBRSxVQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNULElBQU0sU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQzFELElBQU0sSUFBSSxHQUFzQjtnQkFDNUIsU0FBUyxFQUFFLFNBQVM7Z0JBQ3BCLFlBQVksRUFBRSxDQUFRO2dCQUN0QixTQUFTLEVBQUUsSUFBSTtnQkFDZixRQUFRLEVBQUUsSUFBSTtnQkFDZCxJQUFJLEVBQUUsSUFBSTthQUNiLENBQUE7WUFFRCxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTNCLE9BQU87Z0JBQU8sY0FBYztxQkFBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO29CQUFkLHlCQUFjOzs7O3dCQUN4QixzQkFBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO2dDQUMvQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztnQ0FFakIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQ0FFekIsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7Z0NBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDOzRCQUMzQixDQUFDLENBQUMsRUFBQzs7O2FBQ04sQ0FBQTtRQUNMLENBQUM7S0FDSixDQUFDLENBQUM7SUFFSCxPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDIn0=