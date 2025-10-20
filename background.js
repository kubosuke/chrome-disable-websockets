// Background service worker for comprehensive WebSocket blocking
// Note: In Manifest V3, we use declarativeNetRequest rules instead of webRequest API

// Initialize the extension
chrome.runtime.onInstalled.addListener(() => {
    console.log('WebSocket blocking extension installed');

    // Update the declarative net request rules
    chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [
            {
                id: 1001,
                priority: 1,
                action: {
                    type: "block"
                },
                condition: {
                    urlFilter: "ws://*",
                    resourceTypes: ["websocket"]
                }
            },
            {
                id: 1002,
                priority: 1,
                action: {
                    type: "block"
                },
                condition: {
                    urlFilter: "wss://*",
                    resourceTypes: ["websocket"]
                }
            }
        ],
        removeRuleIds: [1001, 1002]
    });
});

// Listen for tab updates to inject content script if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'loading' && tab.url) {
        // The content script will handle WebSocket blocking in the page context
        console.log('Tab updated, WebSocket blocking active for:', tab.url);
    }
});

console.log('WebSocket blocking service worker loaded');