import Stripe from 'stripe';

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

  // Store the secret key in an environment variable or use a secrets manager
  const secretKey =
    process.env.STRIPE_SECRET_KEY ||
    'sk_test_51MWlLsGBL31qIrQExIrjz7aRXJWxfirJB6ABrOzfsccq55HZ3SNYIlDYP66Jv0pLk7WXq1eJkqaKFUlf0VoRnd0600sG0s3rKS';

  if (!secretKey) {
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
      currency: 'usd',
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
