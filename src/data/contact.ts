/** Contact info displayed in Header (logo subtitle), Footer (4-col + copy),
 *  ContactInfo section, and ShowroomLocation. Replace with real data. */

import { ICON_FACEBOOK, ICON_INSTAGRAM, ICON_YOUTUBE, ICON_ZALO } from './icons.ts';

export interface SocialLink {
  name: string;
  url: string;
  /** Inline SVG markup (24×24, currentColor fill). See `src/data/icons.ts`. */
  icon: string;
}

export interface Contact {
  email: string;
  phone: string;
  /** Email subject prefilled when clicking `mailto:` links. */
  subjectPrefill: string;
  address: string;
  socials: SocialLink[];
}

const PHONE_DIGITS = '84900000000';

export const contact: Contact = {
  email: 'contact@example.com',
  phone: '+84 900 000 000',
  subjectPrefill: 'Yêu cầu tư vấn sản phẩm',
  address: 'Số 0, Đường Placeholder, Quận Lorem, Thành phố Ipsum',
  socials: [
    { name: 'Facebook', url: 'https://facebook.com/yourpage', icon: ICON_FACEBOOK },
    { name: 'Instagram', url: 'https://instagram.com/yourpage', icon: ICON_INSTAGRAM },
    { name: 'YouTube', url: 'https://youtube.com/@yourchannel', icon: ICON_YOUTUBE },
    { name: 'Zalo', url: `https://zalo.me/${PHONE_DIGITS}`, icon: ICON_ZALO },
  ],
};
