/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
  // Optional per-template sender override. If omitted, the function defaults
  // to "Sable & Saffron <hello@sableandsaffron.xyz>".
  fromAddress?: string
  fromName?: string
}

import { template as orderConfirmation } from './order-confirmation.tsx'
import { template as welcome } from './welcome.tsx'
import { template as newOrderOwner } from './new-order-owner.tsx'
import { template as contactEnquiry } from './contact-enquiry.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'order-confirmation': orderConfirmation,
  'welcome': welcome,
  'new-order-owner': newOrderOwner,
  'contact-enquiry': contactEnquiry,
}
