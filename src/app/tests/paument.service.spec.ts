import {PaymentService} from '../payment/payment.service';

describe('PaymentServiceTest', () => {
  // This pipe is a pure, stateless function so no need for BeforeEach
  const service = new PaymentService(null, null, null, null);
  it('removes new line character from string', () => {
    expect(service.removeEol('a\nbc')).toBe('abc');
  });
});
