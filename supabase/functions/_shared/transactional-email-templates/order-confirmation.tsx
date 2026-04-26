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
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Sable & Saffron'

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface OrderConfirmationProps {
  customerName?: string
  orderId?: string
  items?: OrderItem[]
  subtotal?: number
  shippingAddress?: {
    line1: string
    line2?: string
    city: string
    postcode: string
  }
}

const formatGBP = (amount: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(
    amount,
  )

const OrderConfirmationEmail = ({
  customerName,
  orderId,
  items = [],
  subtotal,
  shippingAddress,
}: OrderConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>
      Thank you for your order from {SITE_NAME}
      {orderId ? ` — #${orderId.slice(0, 8)}` : ''}
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {customerName ? `Thank you, ${customerName}` : 'Thank you for your order'}
        </Heading>
        <Text style={text}>
          Thank you for your order. We've received your payment and your scarf
          is being carefully prepared for dispatch. You'll receive a shipping
          update soon.
        </Text>

        {orderId && (
          <Text style={meta}>
            Order reference: <strong>{orderId.slice(0, 8).toUpperCase()}</strong>
          </Text>
        )}

        {items.length > 0 && (
          <Section style={card}>
            <Heading as="h2" style={h2}>Your order</Heading>
            {items.map((item, idx) => (
              <Section key={idx} style={itemRow}>
                <Text style={itemText}>
                  {item.name} <span style={muted}>× {item.quantity}</span>
                </Text>
                <Text style={itemPrice}>
                  {formatGBP(item.price * item.quantity)}
                </Text>
              </Section>
            ))}
            {typeof subtotal === 'number' && (
              <>
                <Hr style={hr} />
                <Section style={itemRow}>
                  <Text style={totalLabel}>Total</Text>
                  <Text style={totalPrice}>{formatGBP(subtotal)}</Text>
                </Section>
              </>
            )}
          </Section>
        )}

        {shippingAddress && (
          <Section style={card}>
            <Heading as="h2" style={h2}>Shipping to</Heading>
            <Text style={text}>
              {shippingAddress.line1}
              {shippingAddress.line2 ? <><br />{shippingAddress.line2}</> : null}
              <br />
              {shippingAddress.city}, {shippingAddress.postcode}
            </Text>
          </Section>
        )}

        <Text style={footer}>
          Questions? Just reply to this email and we'll be in touch.
          <br />
          With love, {SITE_NAME}
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OrderConfirmationEmail,
  subject: (data: Record<string, any>) =>
    `Your ${SITE_NAME} order is confirmed — #${
      data?.orderId ? String(data.orderId).slice(0, 8).toUpperCase() : 'ORDER'
    }`,
  displayName: 'Order confirmation',
  fromAddress: 'orders@sableandsaffron.xyz',
  fromName: 'Sable & Saffron Orders',
  previewData: {
    customerName: 'Shreya',
    orderId: '8a4dc787-406c-437a-bec7-2dd50fec7e4d',
    items: [
      { name: 'Soft Terracotta Scarf', quantity: 1, price: 12.99 },
      { name: 'Dusty Sage Scarf', quantity: 2, price: 12.99 },
    ],
    subtotal: 38.97,
    shippingAddress: {
      line1: '12 Marylebone Lane',
      city: 'London',
      postcode: 'W1U 2NE',
    },
  },
} satisfies TemplateEntry

// --- Styles ---
const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
}
const container = {
  padding: '32px 28px',
  maxWidth: '560px',
  margin: '0 auto',
}
const h1 = {
  fontFamily: '"Cormorant Garamond", Georgia, serif',
  fontSize: '28px',
  fontWeight: 500,
  color: '#2C2C2C',
  margin: '0 0 16px',
}
const h2 = {
  fontFamily: '"Cormorant Garamond", Georgia, serif',
  fontSize: '18px',
  fontWeight: 500,
  color: '#2C2C2C',
  margin: '0 0 12px',
}
const text = {
  fontSize: '15px',
  color: '#555555',
  lineHeight: '1.6',
  margin: '0 0 16px',
}
const meta = {
  fontSize: '14px',
  color: '#666666',
  margin: '0 0 24px',
}
const card = {
  backgroundColor: '#FAF7F2',
  borderRadius: '8px',
  padding: '20px',
  margin: '0 0 20px',
}
const itemRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  margin: '4px 0',
}
const itemText = {
  fontSize: '14px',
  color: '#2C2C2C',
  margin: 0,
  flex: 1,
}
const muted = {
  color: '#999999',
}
const itemPrice = {
  fontSize: '14px',
  color: '#2C2C2C',
  margin: 0,
  fontWeight: 500,
}
const totalLabel = {
  fontSize: '15px',
  color: '#2C2C2C',
  margin: 0,
  fontWeight: 600,
}
const totalPrice = {
  fontSize: '15px',
  color: '#C4775A',
  margin: 0,
  fontWeight: 600,
}
const hr = {
  borderColor: '#E8E2D5',
  margin: '12px 0',
}
const footer = {
  fontSize: '13px',
  color: '#999999',
  lineHeight: '1.6',
  margin: '32px 0 0',
}
