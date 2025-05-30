export function isInAppBrowser(): boolean {
    // Check if the app is running in a browser environment
    const userAgent = window.navigator.userAgent.toLowerCase();
    return ['linkedin', 'telegram', 'instagram', 'facebook', 'twitter']
    .some(browser => userAgent.includes(browser));
}