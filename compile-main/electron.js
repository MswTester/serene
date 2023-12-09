"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
var fs = require("fs");
var isDev = require("electron-is-dev");
var BASE_URL = 'http://localhost:3000';
// BrowserWindow 객체는 전역으로 관리합니다.
// 전역이 아닌 경우 자바스크립트 가비지 컬렉팅 발생 시 의도치 않게 browser window가 닫힐 수 있습니다. 
var mainWindow = null;
var createWindow = function () {
    // browser window를 생성합니다.
    mainWindow = new electron_1.BrowserWindow({
        minWidth: 600,
        minHeight: 400,
        width: 1200,
        height: 800,
        resizable: true,
        autoHideMenuBar: true,
        icon: path.join(__dirname, '../public/favicon.ico'),
        webPreferences: {
            devTools: isDev,
            nodeIntegration: true
        }
    });
    // 앱의 index.html을 로드합니다.
    if (isDev) { // 개발 모드인 경우
        mainWindow.loadURL(BASE_URL); // 개발 도구에서 호스팅하는 주소로 로드합니다. 
        mainWindow.webContents.openDevTools({ mode: 'detach' }); // DevTools를 엽니다.
    }
    else { // 프로덕션 모드인 경우
        mainWindow.loadFile(path.join(__dirname, './build/index.html')); // 
    }
    electron_1.ipcMain.on('get-maps', function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var maps;
        return __generator(this, function (_a) {
            fs.existsSync(path.join(__dirname, '../maps')) || fs.mkdirSync(path.join(__dirname, '../maps'));
            maps = fs.readdirSync(path.join(__dirname, '../maps'));
            event.reply('get-maps-reply', maps);
            return [2 /*return*/];
        });
    }); });
};
// Electron이 준비되면 whenReady 메서드가 호출되어,
// 초기화 및 browser window를 생성합니다.
electron_1.app.whenReady().then(function () {
    createWindow();
    // Linux와 Winodws 앱은 browser window가 열려 있지 않을 때 종료됩니다.
    // macOS는 browser window가 열려 있지 않아도 계속 실행되기 때문에,
    // browser window가 열려 있지 않을 때 앱을 활성화 하면 새로운 browser window를 열어줍니다.
    electron_1.app.on('activate', function () {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
// Linux와 Winodws에서는 모든 창을 종료하면 일반적으로 앱이 완전히 종료됩니다.
// macOS(darwin)가 아닌 경우, 'window-all-closed' 이벤트가 발생했을 때, 앱을 종료합니다.
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
