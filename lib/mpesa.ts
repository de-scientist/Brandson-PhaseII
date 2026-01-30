import crypto from 'crypto'

// M-Pesa Daraja API Configuration
const MPESA_CONFIG = {
  consumerKey: process.env.MPESA_CONSUMER_KEY || 'demo_consumer_key',
  consumerSecret: process.env.MPESA_CONSUMER_SECRET || 'demo_consumer_secret',
  passKey: process.env.MPESA_PASS_KEY || 'demo_pass_key',
  shortcode: process.env.MPESA_SHORTCODE || '174379',
  callbackUrl: process.env.MPESA_CALLBACK_URL || 'http://localhost:3000/api/payments/mpesa/callback',
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
}

// M-Pesa API URLs
const MPESA_URLS = {
  oauth: 'https://api.safaricom.co.ke/oauth/v1/generate',
  stkPush: 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
  transactionStatus: 'https://api.safaricom.co.ke/mpesa/transactionstatus/v1/query',
}

// Sandbox URLs for testing
const SANDBOX_URLS = {
  oauth: 'https://sandbox.safaricom.co.ke/oauth/v1/generate',
  stkPush: 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
  transactionStatus: 'https://sandbox.safaricom.co.ke/mpesa/transactionstatus/v1/query',
}

export interface MpesaPaymentRequest {
  phoneNumber: string
  amount: number
  accountReference: string
  transactionDesc: string
  callbackUrl?: string
}

export interface MpesaResponse {
  success: boolean
  message: string
  data?: {
    CheckoutRequestID?: string
    MerchantRequestID?: string
    ResponseCode?: string
    ResponseDescription?: string
    CustomerMessage?: string
  }
  error?: string
}

export interface MpesaCallback {
  Body: {
    stkCallback: {
      MerchantRequestID: string
      CheckoutRequestID: string
      ResultCode: number
      ResultDesc: string
      CallbackMetadata?: {
        Item: Array<{
          Name: string
          Value?: string | number
        }>
      }
    }
  }
}

/**
 * Get M-Pesa OAuth Access Token
 */
export async function getMpesaAccessToken(): Promise<string> {
  try {
    const urls = MPESA_CONFIG.environment === 'production' ? MPESA_URLS : SANDBOX_URLS
    const auth = Buffer.from(`${MPESA_CONFIG.consumerKey}:${MPESA_CONFIG.consumerSecret}`).toString('base64')
    
    const response = await fetch(`${urls.oauth}?grant_type=client_credentials`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get M-Pesa access token: ${response.statusText}`)
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error('M-Pesa OAuth error:', error)
    throw new Error('Failed to authenticate with M-Pesa')
  }
}

/**
 * Generate M-Pesa password for STK Push
 */
export function generateMpesaPassword(): string {
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)
  const passwordString = `${MPESA_CONFIG.shortcode}${MPESA_CONFIG.passKey}${timestamp}`
  return Buffer.from(passwordString).toString('base64')
}

/**
 * Initiate M-Pesa STK Push
 */
export async function initiateStkPush(request: MpesaPaymentRequest): Promise<MpesaResponse> {
  try {
    // Validate phone number (Kenyan format)
    const formattedPhone = formatPhoneNumber(request.phoneNumber)
    if (!formattedPhone) {
      return {
        success: false,
        message: 'Invalid phone number format. Use Kenyan number format (e.g., 07XXXXXXXX or 2547XXXXXXXX)',
      }
    }

    const accessToken = await getMpesaAccessToken()
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)
    const password = generateMpesaPassword()
    
    const urls = MPESA_CONFIG.environment === 'production' ? MPESA_URLS : SANDBOX_URLS
    const callbackUrl = request.callbackUrl || MPESA_CONFIG.callbackUrl

    const stkPushRequest = {
      BusinessShortCode: MPESA_CONFIG.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: request.amount,
      PartyA: formattedPhone,
      PartyB: MPESA_CONFIG.shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: request.accountReference.slice(0, 12), // Max 12 characters
      TransactionDesc: request.transactionDesc.slice(0, 13), // Max 13 characters
    }

    const response = await fetch(urls.stkPush, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stkPushRequest),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('M-Pesa STK Push error:', errorData)
      return {
        success: false,
        message: 'Failed to initiate M-Pesa payment',
        error: errorData.errorMessage || response.statusText,
      }
    }

    const data = await response.json()
    
    if (data.ResponseCode === '0') {
      return {
        success: true,
        message: 'M-Pesa STK Push initiated successfully',
        data: {
          CheckoutRequestID: data.CheckoutRequestID,
          MerchantRequestID: data.MerchantRequestID,
          ResponseCode: data.ResponseCode,
          ResponseDescription: data.ResponseDescription,
          CustomerMessage: data.CustomerMessage,
        },
      }
    } else {
      return {
        success: false,
        message: data.ResponseDescription || 'Failed to initiate M-Pesa payment',
        error: data.ResponseCode,
      }
    }
  } catch (error) {
    console.error('M-Pesa STK Push error:', error)
    return {
      success: false,
      message: 'Failed to initiate M-Pesa payment',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Query M-Pesa transaction status
 */
export async function queryTransactionStatus(checkoutRequestID: string): Promise<MpesaResponse> {
  try {
    const accessToken = await getMpesaAccessToken()
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)
    const password = generateMpesaPassword()
    
    const urls = MPESA_CONFIG.environment === 'production' ? MPESA_URLS : SANDBOX_URLS

    const statusRequest = {
      BusinessShortCode: MPESA_CONFIG.shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestID,
      OriginatorConversationID: '',
      TransactionType: 'CustomerPayBillOnline',
    }

    const response = await fetch(urls.transactionStatus, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statusRequest),
    })

    if (!response.ok) {
      throw new Error(`Failed to query transaction status: ${response.statusText}`)
    }

    const data = await response.json()
    
    return {
      success: true,
      message: 'Transaction status retrieved successfully',
      data: data,
    }
  } catch (error) {
    console.error('M-Pesa transaction status query error:', error)
    return {
      success: false,
      message: 'Failed to query transaction status',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Format Kenyan phone number
 */
function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Handle different formats
  if (cleaned.startsWith('254') && cleaned.length === 12) {
    return cleaned
  } else if (cleaned.startsWith('0') && cleaned.length === 10) {
    return `254${cleaned.slice(1)}`
  } else if (cleaned.startsWith('7') && cleaned.length === 9) {
    return `254${cleaned}`
  }
  
  return ''
}

/**
 * Process M-Pesa callback
 */
export function processMpesaCallback(callbackData: MpesaCallback): {
  success: boolean
  resultCode: number
  resultDesc: string
  checkoutRequestID: string
  merchantRequestID: string
  mpesaReceipt?: string
  phoneNumber?: string
  amount?: number
  transactionDate?: string
} {
  const { stkCallback } = callbackData.Body
  
  const result = {
    success: stkCallback.ResultCode === 0,
    resultCode: stkCallback.ResultCode,
    resultDesc: stkCallback.ResultDesc,
    checkoutRequestID: stkCallback.CheckoutRequestID,
    merchantRequestID: stkCallback.MerchantRequestID,
  }

  // Extract metadata if available
  if (stkCallback.CallbackMetadata?.Item) {
    const metadata = stkCallback.CallbackMetadata.Item
    
    const mpesaReceipt = metadata.find(item => item.Name === 'MpesaReceiptNumber')
    const phoneNumber = metadata.find(item => item.Name === 'PhoneNumber')
    const amount = metadata.find(item => item.Name === 'Amount')
    const transactionDate = metadata.find(item => item.Name === 'TransactionDate')
    
    return {
      ...result,
      mpesaReceipt: mpesaReceipt?.Value as string,
      phoneNumber: phoneNumber?.Value as string,
      amount: amount?.Value as number,
      transactionDate: transactionDate?.Value as string,
    }
  }
  
  return result
}

/**
 * Validate M-Pesa configuration
 */
export function validateMpesaConfig(): { valid: boolean; missing: string[] } {
  const required = [
    'MPESA_CONSUMER_KEY',
    'MPESA_CONSUMER_SECRET',
    'MPESA_PASS_KEY',
    'MPESA_SHORTCODE',
    'MPESA_CALLBACK_URL',
  ]
  
  const missing = required.filter(key => !process.env[key])
  
  return {
    valid: missing.length === 0,
    missing,
  }
}
