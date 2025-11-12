import { render, screen } from '@testing-library/react';
import { MoneyValue } from '@/components/money';

describe('MoneyValue', () => {
  it('formats USD values', () => {
    render(<MoneyValue money={{ amount: '1250', currencyCode: 'USD' }} />);
    expect(screen.getByText('$1,250.00')).toBeInTheDocument();
  });
});
