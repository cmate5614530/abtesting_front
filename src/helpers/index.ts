export * from './ai'

export const CHANGE_ABLE_ITEMS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'b', 'strong']
export const ACTIONABEL_ITEMS = ['form', 'button', 'a'] 
export const ALL_ITEMS = [...CHANGE_ABLE_ITEMS, ...ACTIONABEL_ITEMS] 

export const isChangeAble = (tag) => CHANGE_ABLE_ITEMS.includes(tag);
export const isActionable = (tag) => ACTIONABEL_ITEMS.includes(tag);

export const formatUSD = (stripeAmount) => {
    return `$${(stripeAmount / 100).toFixed(2)}`;
}
  
export const formatStripeAmount = (USDString) => {
    return parseFloat(USDString) * 100;
}