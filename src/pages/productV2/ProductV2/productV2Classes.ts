import { cn } from '@/lib/utils';

export const productV2Layout = {
  pageRoot:
    'relative flex h-[982px] w-[1512px] items-start justify-center bg-gray-50',
  mainColumn: 'flex w-[1212px] flex-col items-start relative',
  homeBody:
    'flex h-[766px] items-center justify-center gap-2.5 self-stretch w-full p-8 relative',
  homeBodyInner:
    'flex max-w-[1148px] flex-1 grow items-center gap-8 self-stretch relative',
  twoColLeft:
    'flex flex-1 grow flex-col items-center justify-center gap-4 self-stretch relative',
  twoColRight:
    'flex flex-1 grow flex-col items-start justify-center gap-4 self-stretch relative',
  navAside:
    'flex h-screen w-[300px] flex-col items-center justify-between border-r border-solid border-gray-50 bg-white px-8 py-12 relative',
} as const;

export const productV2Header = {
  shell:
    'flex flex-col items-center justify-center gap-8 self-stretch w-full flex-[0_0_auto] border-b border-solid border-gray-50 bg-white px-8 pb-4 pt-8 relative',
  inner: 'flex flex-col items-start gap-8 self-stretch w-full flex-[0_0_auto] relative',
  row: 'flex flex-[0_0_auto] items-center justify-between self-stretch w-full relative',
  statCluster: 'inline-flex flex-[0_0_auto] items-center justify-center gap-2 relative',
  statValue: 'text-h5-medium text-gray-black whitespace-nowrap relative',
  statDivider: 'relative h-5 w-px bg-gray-400',
  statLabelCol: 'inline-flex flex-[0_0_auto] flex-col items-center justify-center relative',
  statLabelTitle: 'text-body-regular text-gray-black relative self-stretch',
  statLabelHint: 'text-caption-lg-regular text-gray-500 relative self-stretch',
  actionsRow: 'inline-flex flex-[0_0_auto] items-center gap-2 relative',
  pageTitle: 'text-h5-medium text-gray-black relative w-fit whitespace-nowrap',
  filterCluster: 'relative flex w-[188px] items-center justify-center gap-2',
} as const;

export function promoBackgroundImage(imageUrl: string) {
  return {
    backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.2) 100%), url(${imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } as const;
}

export const productV2Promo = {
  baseCover: 'bg-cover bg-center',
  /** Large rounded tiles used across promos */
  radiusTile: 'rounded-[32px]',
  leftTopStack: 'flex h-[417px] flex-col items-start gap-4 self-stretch w-full relative',
  leftBottomRow:
    'flex flex-1 grow items-center justify-center gap-4 self-stretch w-full px-0 py-0.5 relative',
  titleOnImage: 'text-h5-medium text-white relative self-stretch',
  subtitleOnImage: 'text-body-regular text-white relative self-stretch',
  borderedTile: 'border border-solid border-gray-50',
  shellDiscountCta: cn(
    'relative flex w-full flex-1 grow flex-col items-center justify-center gap-2 self-stretch overflow-hidden p-4',
  ),
  shellHeadlineRow: cn(
    'relative flex w-full flex-1 grow items-center justify-center gap-[93px] self-stretch overflow-hidden p-4',
  ),
  shellOfferFavorite: cn(
    'relative flex w-full flex-1 grow flex-col items-center justify-between self-stretch overflow-hidden p-4',
  ),
  shellPrelineExternal: cn(
    'relative flex w-full flex-1 grow items-center justify-center gap-[93px] self-stretch overflow-hidden p-4',
  ),
  flexStackCenter: 'flex flex-1 grow flex-col items-center justify-center gap-2.5 relative',
  flexStackStart: 'flex flex-1 grow flex-col items-start justify-center gap-2.5 relative',
  titleBlock: 'flex flex-[0_0_auto] flex-col items-start justify-center relative w-full self-stretch',
  actionsEndRow: 'inline-flex flex-[0_0_auto] items-start justify-end gap-2.5 relative self-stretch',
  actionsEndRowFull: cn(
    'flex flex-[0_0_auto] w-full items-start justify-end gap-2.5 relative self-stretch',
  ),
} as const;

export const productV2Product = {
  gridRow:
    'flex h-[522px] items-center justify-center gap-4 self-stretch w-full relative',
  /** Card root: merges with shadcn Card flex/gap resets via className in component */
  card: cn(
    'relative flex flex-1 grow flex-col items-center justify-center gap-0 self-stretch overflow-hidden rounded-2xl border border-solid border-gray-50 bg-card p-0 py-0 text-card-foreground shadow-none ring-0',
  ),
  cardImageWrap: 'flex flex-1 grow flex-col items-center gap-2.5 relative self-stretch w-full',
  cardImageInner: 'flex flex-1 grow flex-col items-center gap-2.5 p-4 relative self-stretch w-full',
  metaRow:
    'flex flex-col gap-2.5 self-stretch w-full flex-[0_0_auto] items-center p-4 relative',
} as const;

export const productV2Controls = {
  iconPillSm: cn(
    'inline-flex flex-[0_0_auto] items-center gap-2 overflow-hidden rounded-2xl bg-gray-50 p-2 relative',
  ),
  iconPillNav: cn(
    'inline-flex flex-[0_0_auto] items-center gap-2 overflow-hidden rounded-[60px] bg-gray-50 p-4 relative',
  ),
  iconPillCart: cn(
    'inline-flex flex-[0_0_auto] items-center gap-2 overflow-hidden rounded-2xl bg-gray-50 p-4 relative',
  ),
  softCtaWide: cn(
    'relative flex flex-1 grow items-center justify-center gap-2.5 overflow-hidden rounded-[32px] bg-gray-50 px-8 py-3',
  ),
  softCtaLabel: 'text-body-regular whitespace-nowrap text-gray-black relative w-fit',
  glassCtaWide: cn(
    'flex flex-[0_0_auto] w-[188px] items-center justify-center gap-2.5 overflow-hidden rounded-[32px] bg-gray-50/70 px-8 py-3 relative',
  ),
  glassCtaLabel: 'text-body-regular whitespace-nowrap text-gray-500 relative w-fit',
  profileButton: cn(
    'inline-flex flex-[0_0_auto] items-center justify-center gap-2.5 overflow-hidden rounded-[64px] bg-white p-2 relative',
  ),
  profileAvatar: cn(
    'relative h-10 w-10 rounded-[64px] bg-cover bg-center',
  ),
  profileName: 'text-body-regular whitespace-nowrap text-gray-black relative w-fit',
  navItemBase: cn(
    'relative flex flex-[0_0_auto] w-full items-center gap-2 overflow-hidden rounded-2xl p-4 text-left',
  ),
  navItemInactive: 'bg-white text-gray-black',
  navItemActive: 'bg-gray-black text-gray-white',
  logoutRow: cn(
    'relative flex flex-[0_0_auto] w-full items-center gap-2 overflow-hidden rounded-2xl bg-white p-4 text-left',
  ),
  orderRow: cn(
    'relative flex flex-[0_0_auto] w-full items-center gap-2 overflow-hidden rounded-2xl bg-white px-4 py-2 text-left',
  ),
  orderThumb: cn('relative h-7 w-7 rounded-md bg-cover bg-center'),
} as const;

export function navItemClasses(active: boolean) {
  return cn(
    productV2Controls.navItemBase,
    active ? productV2Controls.navItemActive : productV2Controls.navItemInactive,
  );
}
