export interface PolicySection {
  heading: string;
  body: string[];
}

export interface Policy {
  slug: string;
  title: string;
  intro: string;
  sections: PolicySection[];
}

export const policies: Policy[] = [
  {
    slug: 'shipping',
    title: 'Shipping and Delivery',
    intro:
      'We deliver poetry-inspired merchandise and personalized pieces across Kenya. Delivery timelines and charges depend on your location and the type of piece you order.',
    sections: [
      {
        heading: 'Delivery across Kenya',
        body: [
          'Orders within Nakuru are typically delivered within 1–3 working days. Deliveries to Nairobi and other major towns usually take 2–4 working days. Remote areas may take longer.',
          'Delivery charges are calculated at checkout based on your county and the courier used.',
        ],
      },
      {
        heading: 'Personalized and commissioned pieces',
        body: [
          'Personalized notes and commissioned poems are made to order. Writing and preparation time is additional to delivery time. We will confirm the expected timeline when we begin your piece.',
          'Digital pieces are delivered by email. Printed pieces are delivered as physical items.',
        ],
      },
      {
        heading: 'Tracking and contact',
        body: [
          'Where a courier provides tracking, we will share the details with you. If you have any questions about an order in progress, contact us and quote your order number.',
        ],
      },
    ],
  },
  {
    slug: 'returns',
    title: 'Returns and Refunds',
    intro:
      'We want you to be happy with your order. Because many of our pieces are made to order, some items are handled differently from standard merchandise.',
    sections: [
      {
        heading: 'Standard merchandise',
        body: [
          'If a clothing item does not fit or arrives faulty, contact us within 7 days of delivery. Unworn, unwashed items in their original condition may be exchanged or refunded.',
          'Items that have been worn, washed or altered cannot be returned unless faulty.',
        ],
      },
      {
        heading: 'Personalized and commissioned pieces',
        body: [
          'Personalized notes and commissioned poems are created uniquely for you and cannot be returned or refunded once writing has begun, except where the piece is faulty or does not match the agreed brief.',
          'If a personalized piece does not meet the brief, contact us and we will work with you to make it right.',
        ],
      },
      {
        heading: 'Refunds',
        body: [
          'Approved refunds are processed to the original payment method. M-Pesa refunds are returned to the number used for payment.',
        ],
      },
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    intro:
      'Walking Shadow Poetry respects your privacy. This policy explains what information we collect and how we use it.',
    sections: [
      {
        heading: 'Information we collect',
        body: [
          'When you place an order or submit a commission, we collect your name, email address, phone number and delivery details. For personalized pieces, we also collect the details you choose to share about the recipient and occasion.',
          'Payment is processed through M-Pesa. We do not store your M-Pesa PIN or full payment credentials.',
        ],
      },
      {
        heading: 'How we use your information',
        body: [
          'We use your information to fulfil orders, deliver personalized pieces, respond to enquiries, and — where you have opted in — send updates about new collections and poetry releases.',
          'We do not sell your personal information.',
        ],
      },
      {
        heading: 'Your choices',
        body: [
          'You may unsubscribe from our newsletter at any time. To request access to, correction of, or deletion of your information, contact us.',
        ],
      },
    ],
  },
  {
    slug: 'terms',
    title: 'Terms and Conditions',
    intro:
      'By using this shop you agree to these terms. Please read them carefully before placing an order.',
    sections: [
      {
        heading: 'Orders',
        body: [
          'All orders are subject to availability and confirmation of payment. Prices are shown in Kenyan Shillings (KES).',
          'We reserve the right to decline or cancel an order where necessary, including in cases of suspected fraud or error.',
        ],
      },
      {
        heading: 'Personalized and commissioned work',
        body: [
          'When you commission a piece, you confirm that you have the right to share any information you provide about a recipient, and that the content does not infringe the rights of others.',
          'Ownership of the finished piece is transferred to you upon full payment. Walking Shadow Poetry retains the right to reference the work in its portfolio unless you request otherwise.',
        ],
      },
      {
        heading: 'Intellectual property',
        body: [
          'All written work, designs, photography and branding on this site belong to Walking Shadow Poetry and may not be reproduced without permission.',
        ],
      },
    ],
  },
];

export function getPolicy(slug: string) {
  return policies.find((policy) => policy.slug === slug) ?? null;
}
