/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Sable & Saffron'
const SITE_URL = 'https://www.sableandsaffron.xyz'

interface WelcomeProps {
  customerName?: string
}

const WelcomeEmail = ({ customerName }: WelcomeProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Welcome to {SITE_NAME} — soft layers for everyday warmth</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {customerName ? `Welcome, ${customerName}` : `Welcome to ${SITE_NAME}`}
        </Heading>
        <Text style={text}>
          Thank you for joining us. We hand-pick scarves designed to feel like
          a quiet ritual — soft layers, warm tones, and pieces made to be loved
          for years.
        </Text>
        <Text style={text}>
          Your account is ready. Save your favourites, follow your orders, and
          enjoy a calm, considered shopping experience.
        </Text>
        <Section style={{ textAlign: 'center', margin: '28px 0' }}>
          <Button href={`${SITE_URL}/#/shop`} style={button}>
            Explore the collection
          </Button>
        </Section>
        <Text style={footer}>
          With warmth,<br />
          The {SITE_NAME} team
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: WelcomeEmail,
  subject: `Welcome to ${SITE_NAME}`,
  displayName: 'Welcome email',
  previewData: { customerName: 'Shreya' },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
}
const container = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
const h1 = {
  fontFamily: '"Cormorant Garamond", Georgia, serif',
  fontSize: '28px',
  fontWeight: 500,
  color: '#2C2C2C',
  margin: '0 0 16px',
}
const text = {
  fontSize: '15px',
  color: '#555555',
  lineHeight: '1.7',
  margin: '0 0 16px',
}
const button = {
  backgroundColor: '#3D7A78',
  color: '#FAF7F2',
  padding: '12px 28px',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: 500,
  textDecoration: 'none',
  display: 'inline-block',
}
const footer = {
  fontSize: '13px',
  color: '#999999',
  lineHeight: '1.6',
  margin: '32px 0 0',
}
