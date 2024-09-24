export const kickToLogin = (redirect?: string) =>
    (window.location.href = `${window.location.protocol + '//' + window.location.host}/login${redirect ? `?redirect=${redirect}` : ''}`);

export const kickTo = (location: string) =>
    (window.location.href = `${window.location.protocol + '//' + window.location.host}/${location}`);
