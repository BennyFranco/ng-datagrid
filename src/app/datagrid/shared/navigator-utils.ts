export function getNavigator(): string {
    const sayswho = (function () {
        // tslint:disable-next-line:prefer-const
        let ua = navigator.userAgent, tem,
            M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE ' + (tem[1] || '');
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if (tem != null) {
                return tem.slice(1).join(' ').replace('OPR', 'Opera');
            }
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) {
            M.splice(1, 1, tem[1]);
        }
        return M.join(' ');
    })();
    return sayswho;
}


export function isMicrosoftNavigator(): boolean {
    const navigator = getNavigator().split(' ');
    return navigator[0] === 'Edge' || navigator[0] === 'IE' ? true : false;
}

export function isFirefox(): boolean {
    const navigator = getNavigator().split(' ');
    return navigator[0] === 'Firefox' ? true : false;
}
