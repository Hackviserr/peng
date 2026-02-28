import type { FindingTemplate } from '../../constants';

import { injectionTemplates } from './injection';
import { xssTemplates } from './xss';
import { accessControlTemplates } from './access-control';
import { authenticationTemplates } from './authentication';
import { misconfigurationTemplates } from './misconfiguration';
import { sslTlsTemplates } from './ssl-tls';
import { networkTemplates } from './network';
import { infoDisclosureTemplates } from './info-disclosure';
import { ssrfTemplates } from './ssrf';
import { cryptoTemplates } from './crypto';
import { apiTemplates } from './api-security';
import { businessLogicTemplates } from './business-logic';
import { cloudTemplates } from './cloud';
import { mobileTemplates } from './mobile';
import { otherTemplates } from './other';

export const ALL_TEMPLATES: FindingTemplate[] = [
    ...injectionTemplates,
    ...xssTemplates,
    ...accessControlTemplates,
    ...authenticationTemplates,
    ...misconfigurationTemplates,
    ...sslTlsTemplates,
    ...networkTemplates,
    ...infoDisclosureTemplates,
    ...ssrfTemplates,
    ...cryptoTemplates,
    ...apiTemplates,
    ...businessLogicTemplates,
    ...cloudTemplates,
    ...mobileTemplates,
    ...otherTemplates,
];
