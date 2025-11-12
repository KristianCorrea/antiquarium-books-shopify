import type { Money } from '@/types/shopify';

export const MoneyValue = ({ money }: { money: Money }) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: money.currencyCode
  });

  return <span>{formatter.format(parseFloat(money.amount))}</span>;
};
