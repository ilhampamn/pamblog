import { z } from 'zod';

const CURRENT_VERSION = 2;

export const NavbarConfigSchema = z.object({
  logo: z.string().nullable().default(null),
  altText: z.string().default(''),
  showLanguageToggle: z.boolean().default(false),
  locale: z.string().default('en'),
});

export const ProductConfigSchema = z.object({
  name: z.string().min(1),
  image: z.string().nullable().default(null),
  currency: z.string().length(3).default('USD'),
  finalPrice: z.number().nonnegative(),
  originalPrice: z.number().nonnegative().nullable().default(null),
  discountLabel: z.union([z.literal('auto'), z.string()]).default('auto'),
  taxIncluded: z.boolean().default(true),
});

export const RewardsConfigSchema = z.object({
  enabled: z.boolean().default(true),
  icon: z.string().nullable().default(null),
  label: z.string().default('Earn'),
  amount: z.number().nonnegative().default(0),
});

export const METHOD_IDS = [
  'saved_visa', 'saved_mc', 'add_card',
  'google_pay', 'apple_pay', 'paypal', 'cash_app',
] as const;
export type MethodId = typeof METHOD_IDS[number];

export const PaymentsConfigSchema = z.object({
  order: z.array(z.enum(METHOD_IDS)).default([...METHOD_IDS]),
  visible: z.record(z.enum(METHOD_IDS), z.boolean()).default(
    Object.fromEntries(METHOD_IDS.map((id) => [id, true])) as Record<MethodId, boolean>
  ),
  savedCards: z.boolean().default(true),
  defaultSelected: z.enum(METHOD_IDS).default('saved_visa'),
});

export const ThemeConfigSchema = z.object({
  tokensCss: z.string().default(''),
  savedThemeName: z.string().nullable().default(null),
  /** Decorative skin — structural pseudo-element effects (gloss, shine, gradient borders).
   *  'glossy' activates the .candy CSS layer in CheckoutRoot. */
  skin: z.enum(['none', 'glossy']).default('none'),
});

// ── Screens ──────────────────────────────────────────────────────────────────

export const LoadingConfigSchema = z.object({
  loaderType: z.enum(['dots', 'image']).default('dots'),
  /** Only used when loaderType === 'image' */
  customAsset: z.object({
    src: z.string(),
    kind: z.enum(['gif', 'webp', 'png']),
  }).nullable().default(null),
});

// Shared result-screen pieces
const ResultNavbarConfigSchema = z.object({
  storeName: z.string().default('Web Store'),
  logoSrc: z.string().nullable().default(null),
  showAvatar: z.boolean().default(true),
});

const ResultHeroConfigSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
});

const RewardCardConfigSchema = z.object({
  enabled: z.boolean().default(true),
  imageSrc: z.string().nullable().default(null),
  title: z.string().default('Reward Unlocked'),
  body: z.string().default(''),
  ctaLabel: z.string().default('Claim'),
  ctaHref: z.string().default('#'),
});

const OrderDetailRowConfigSchema = z.object({
  visible: z.boolean().default(true),
  label: z.string(),
});

const OrderDetailsConfigSchema = z.object({
  enabled: z.boolean().default(true),
  showProductCard: z.boolean().default(true),
  playerNickname: OrderDetailRowConfigSchema.default({ visible: true, label: 'Player Nickname' }),
  paymentMethod: OrderDetailRowConfigSchema.default({ visible: true, label: 'Payment Method' }),
  originalPrice: OrderDetailRowConfigSchema.default({ visible: true, label: 'Original Price' }),
  discountedPrice: OrderDetailRowConfigSchema.default({ visible: true, label: 'Discounted Price' }),
});

const ResultFooterCtaConfigSchema = z.object({
  label: z.string(),
  href: z.string().default('#'),
});

/**
 * Per-outcome variant config. The `variants` map is the extension point:
 * add a new key (e.g. 'pending') to support a new outcome without new components.
 */
const ResultVariantConfigSchema = z.object({
  hero: ResultHeroConfigSchema,
  /** Only rendered when present — success only by default */
  rewardCard: RewardCardConfigSchema.optional(),
  /** Failure reason block — only rendered when present */
  reason: z.object({
    visible: z.boolean().default(true),
    text: z.string().default(''),
  }).optional(),
  primaryCta: ResultFooterCtaConfigSchema,
  secondaryCta: ResultFooterCtaConfigSchema.optional(),
});

export const ResultConfigSchema = z.object({
  navbar: ResultNavbarConfigSchema.default({}),
  orderDetails: OrderDetailsConfigSchema.default({}),
  variants: z.object({
    success: ResultVariantConfigSchema,
    failed: ResultVariantConfigSchema,
  }),
});

export const ScreensConfigSchema = z.object({
  loading: LoadingConfigSchema.default({}),
  result: ResultConfigSchema,
}).default({
  loading: { loaderType: 'dots', customAsset: null },
  result: {
    navbar: { storeName: 'Web Store', logoSrc: null, showAvatar: true },
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
        hero: { title: 'Purchase Successful', subtitle: 'Your purchase is complete.' },
        primaryCta: { label: 'Continue', href: '#' },
      },
      failed: {
        hero: { title: 'Payment Failed', subtitle: 'Please try again.' },
        primaryCta: { label: 'Try Again', href: '#' },
      },
    },
  },
});

export const CheckoutConfigSchema = z.object({
  version: z.number().int().default(CURRENT_VERSION),
  navbar: NavbarConfigSchema,
  product: ProductConfigSchema,
  rewards: RewardsConfigSchema,
  payments: PaymentsConfigSchema,
  theme: ThemeConfigSchema,
  screens: ScreensConfigSchema,
  meta: z.object({
    updatedAt: z.string().datetime().optional(),
  }).default({}),
});

export type CheckoutConfig = z.infer<typeof CheckoutConfigSchema>;
export type NavbarConfig = z.infer<typeof NavbarConfigSchema>;
export type ProductConfig = z.infer<typeof ProductConfigSchema>;
export type RewardsConfig = z.infer<typeof RewardsConfigSchema>;
export type PaymentsConfig = z.infer<typeof PaymentsConfigSchema>;
export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;
export type LoadingConfig = z.infer<typeof LoadingConfigSchema>;
export type ResultConfig = z.infer<typeof ResultConfigSchema>;
export type ScreensConfig = z.infer<typeof ScreensConfigSchema>;
