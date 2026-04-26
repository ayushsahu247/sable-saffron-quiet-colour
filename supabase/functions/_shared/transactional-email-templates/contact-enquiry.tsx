/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Sable & Saffron'

interface ContactEnquiryProps {
  name?: string
  email?: string
  subject?: string
  message?: string
}

const ContactEnquiryEmail = ({ name, email, subject, message }: ContactEnquiryProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New enquiry from {name ?? 'a visitor'}{subject ? ` — ${subject}` : ''}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New enquiry from the {SITE_NAME} contact form</Heading>
        <Text style={label}>From</Text>
        <Text style={value}>{name ?? '—'} {email ? `<${email}>` : ''}</Text>
        <Text style={label}>Subject</Text>
        <Text style={value}>{subject ?? '—'}</Text>
        <Hr style={hr} />
        <Text style={label}>Message</Text>
        <Text style={messageStyle}>{message ?? '—'}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactEnquiryEmail,
  subject: (data: Record<string, any>) =>
    `New enquiry - ${data?.subject ?? 'General'} from ${data?.name ?? 'visitor'}`,
  to: 'hello@sableandsaffron.xyz',
  // Server-side backup recipient — never expose on the frontend.
  additionalRecipients: ['shreya.iiitm@gmail.com'],
  displayName: 'Contact form enquiry',
  previewData: {
    name: 'Jane Doe',
    email: 'jane@example.com',
    subject: 'Order enquiry',
    message: 'Hi, I had a quick question about my recent order.',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const h1 = { fontSize: '20px', fontWeight: 600, color: '#1a1a1a', margin: '0 0 24px' }
const label = { fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: '#999', margin: '12px 0 4px' }
const value = { fontSize: '14px', color: '#1a1a1a', margin: '0 0 8px' }
const messageStyle = { fontSize: '14px', color: '#1a1a1a', margin: '0', lineHeight: '1.6', whiteSpace: 'pre-wrap' as const }
const hr = { borderColor: '#eaeaea', margin: '20px 0' }
