import Stripe from 'stripe';
import { STRIPE_SECRET_KEY,  } from '../../../constants';

export default async function handler(
  req: { method: string; body: { price: any } },
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      end: { (): any; new (): any };
      json: {
        (arg0: {
          clientSecret?: string | null;
          amount?: number;
          statusCode?: number;
          message?: any;
        }): void;
        new (): any;
      };
    };
  }
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const secretKey = await STRIPE_SECRET_KEY;

  if (!STRIPE_SECRET_KEY) {
    return res.status(500).json({
      statusCode: 500,
      message: 'Stripe secret key is not set',
    });
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: '2022-11-15',
  });

  try {
    const { price } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
      currency: 'eur',
      payment_method_types: ['card'],
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
    });
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}
