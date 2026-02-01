interface InjectionRule {
    id: string;
    name: string;
    pattern: string;
    script: string;
    active: boolean;
}

const checkAndRequestInjection = async () => {
    const currentUrl = window.location.href;

    chrome.storage.sync.get(['rules'], (result: { rules?: InjectionRule[] }) => {
        const rules = result.rules || [];

        rules.forEach(rule => {
            if (!rule.active) return;

            try {
                const regex = new RegExp(rule.pattern);
                if (regex.test(currentUrl)) {
                    // Instead of injecting directly (which violates CSP),
                    // we ask the background script to handle it.
                    chrome.runtime.sendMessage(
                        {
                            action: 'inject',
                            script: rule.script,
                            name: rule.name,
                        },
                        response => {
                            if (chrome.runtime.lastError) {
                                console.error('[JS Injector] Message error:', chrome.runtime.lastError);
                            } else {
                                console.log('[JS Injector] Injection status:', response?.status);
                            }
                        },
                    );
                }
            } catch (e) {
                console.error(`[JS Injector] Invalid regex for rule "${rule.name}":`, e);
            }
        });
    });
};

checkAndRequestInjection();
