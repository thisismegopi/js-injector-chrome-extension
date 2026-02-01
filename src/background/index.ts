export {};

console.log('JS Injector: Background service worker active');

chrome.runtime.onInstalled.addListener(details => {
    if (details.reason === 'install') {
        chrome.storage.sync.set({ rules: [] });
    }
});

// Handle injection requests from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'inject' && sender.tab?.id) {
        const { script, name } = message;

        // Inject the script into the Main World of the tab
        chrome.scripting
            .executeScript({
                target: { tabId: sender.tab.id },
                world: 'MAIN',
                func: (code, ruleName) => {
                    console.log(`[JS Injector] Executing rule: ${ruleName}`);
                    try {
                        // We use a function constructor to run the code
                        // This avoids direct eval but is still subject to CSP if strict
                        // However, in many cases this is the best we can do for dynamic code
                        const scriptBlob = new Blob([code], { type: 'text/javascript' });
                        const scriptUrl = URL.createObjectURL(scriptBlob);
                        const scriptElement = document.createElement('script');
                        scriptElement.src = scriptUrl;
                        scriptElement.onload = () => URL.revokeObjectURL(scriptUrl);
                        (document.head || document.documentElement).appendChild(scriptElement);
                    } catch (e) {
                        console.error(`[JS Injector] Failed to inject "${ruleName}":`, e);
                    }
                },
                args: [script, name],
            })
            .then(() => {
                sendResponse({ status: 'injected' });
            })
            .catch(err => {
                console.error('Injection failed:', err);
                sendResponse({ status: 'error', error: err.message });
            });

        return true; // Keep message channel open for async response
    }
});
