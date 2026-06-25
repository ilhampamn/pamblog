import type { CheckoutConfig } from './schema.js';

export const RIFT_RACING_FIXTURE: CheckoutConfig = {
  version: 2,
  navbar: {
    logo: null,
    altText: 'Rift Racing',
    showLanguageToggle: true,
    locale: 'en',
  },
  product: {
    name: 'Supercar Game Pack',
    image: null,
    currency: 'USD',
    finalPrice: 3.99,
    originalPrice: 4.99,
    discountLabel: 'auto',
    taxIncluded: true,
  },
  rewards: {
    enabled: true,
    icon: null,
    label: 'Earn',
    amount: 40,
  },
  payments: {
    order: ['saved_visa', 'saved_mc', 'add_card', 'google_pay', 'apple_pay', 'paypal', 'cash_app'],
    visible: {
      saved_visa: true,
      saved_mc: true,
      add_card: true,
      google_pay: true,
      apple_pay: true,
      paypal: false,
      cash_app: false,
    },
    savedCards: true,
    defaultSelected: 'saved_visa',
  },
  theme: {
    tokensCss: '',
    savedThemeName: 'Rift Racing Dark',
    skin: 'none',
  },
  screens: {
    loading: {
      loaderType: 'dots',
      customAsset: null,
    },
    result: {
      navbar: {
        storeName: 'Rift Racing',
        logoSrc: null,
        showAvatar: true,
      },
      orderDetails: {
        enabled: true,
        showProductCard: true,
        playerNickname: { visible: true, label: 'Player Nickname' },
        paymentMethod: { visible: true, label: 'Payment Method' },
        originalPrice: { visible: true, label: 'Original Price' },
        discountedPrice: { visible: true, label: 'Discounted Price' },
      },
      variants: {
        success: {
          hero: {
            title: 'Purchase Successful',
            subtitle: 'Your Supercar Game Pack is ready to play.',
          },
          rewardCard: {
            enabled: true,
            imageSrc: null,
            title: 'Reward Unlocked',
            body: 'You earned 40 Coins! Claim them on the web store.',
            ctaLabel: 'Claim on Web Store',
            ctaHref: '#',
          },
          primaryCta: {
            label: 'Back to Rift Racing',
            href: '#',
          },
        },
        failed: {
          hero: {
            title: 'Payment Failed',
            subtitle: 'Something went wrong. Please try again.',
          },
          reason: {
            visible: true,
            text: '',
          },
          primaryCta: {
            label: 'Try Again',
            href: '#',
          },
        },
      },
    },
  },
  meta: {},
};
