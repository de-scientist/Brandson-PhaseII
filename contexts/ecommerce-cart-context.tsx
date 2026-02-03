"use client"

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { Product, ProductVariant } from '@/lib/database/products'

export interface CartItem {
  id: string
  product: Product
  variant: ProductVariant
  quantity: number
  addedAt: string
}

export interface CartState {
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  itemCount: number
}

export interface ShippingInfo {
  method: 'standard' | 'express' | 'pickup'
  cost: number
  estimatedDays: string
  description: string
}

export interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  company?: string
  address: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

export interface OrderSummary {
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  customerInfo: CustomerInfo
  shippingInfo: ShippingInfo
  paymentMethod: string
  orderNotes?: string
}

const SHIPPING_OPTIONS: ShippingInfo[] = [
  {
    method: 'standard',
    cost: 350,
    estimatedDays: '3-5 business days',
    description: 'Standard delivery within Kenya'
  },
  {
    method: 'express',
    cost: 800,
    estimatedDays: '1-2 business days',
    description: 'Express delivery within major cities'
  },
  {
    method: 'pickup',
    cost: 0,
    estimatedDays: 'Same day',
    description: 'Pickup from our Nairobi office'
  }
]

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; variant: ProductVariant; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_SHIPPING'; payload: ShippingInfo }
  | { type: 'SET_CUSTOMER_INFO'; payload: CustomerInfo }
  | { type: 'LOAD_CART'; payload: CartState }

const TAX_RATE = 0.16 // 16% VAT in Kenya

const calculateTotals = (items: CartItem[], shipping: number = 0) => {
  const subtotal = items.reduce((sum, item) => sum + (item.variant.price * item.quantity), 0)
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax + shipping
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return { subtotal, tax, total, itemCount }
}

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, variant, quantity } = action.payload
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === product.id && item.variant.id === variant.id
      )

      let newItems: CartItem[]
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = [...state.items]
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity
        }
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `${product.id}-${variant.id}`,
          product,
          variant,
          quantity,
          addedAt: new Date().toISOString()
        }
        newItems = [...state.items, newItem]
      }

      const totals = calculateTotals(newItems, state.shipping)
      
      return {
        ...state,
        items: newItems,
        ...totals
      }
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload)
      const totals = calculateTotals(newItems, state.shipping)
      
      return {
        ...state,
        items: newItems,
        ...totals
      }
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload
      
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: id })
      }

      const newItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
      
      const totals = calculateTotals(newItems, state.shipping)
      
      return {
        ...state,
        items: newItems,
        ...totals
      }
    }

    case 'CLEAR_CART': {
      return {
        items: [],
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0,
        itemCount: 0
      }
    }

    case 'SET_SHIPPING': {
      const totals = calculateTotals(state.items, action.payload.cost)
      
      return {
        ...state,
        shipping: action.payload.cost,
        ...totals
      }
    }

    case 'SET_CUSTOMER_INFO': {
      // This would typically be stored separately, but for now we'll include it in cart state
      return state
    }

    case 'LOAD_CART': {
      return action.payload
    }

    default:
      return state
  }
}

const initialState: CartState = {
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0,
  itemCount: 0
}

interface CartContextType {
  cart: CartState
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setShipping: (shipping: ShippingInfo) => void
  isInCart: (productId: string, variantId?: string) => boolean
  getItemQuantity: (productId: string, variantId?: string) => number
  getShippingOptions: () => ShippingInfo[]
  calculateShipping: (items: CartItem[], method: string) => number
  createOrderSummary: (customerInfo: CustomerInfo, shippingMethod: string, paymentMethod: string, orderNotes?: string) => OrderSummary
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useEcommerceCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useEcommerceCart must be used within an EcommerceCartProvider')
  }
  return context
}

export const EcommerceCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('brandson_ecommerce_cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: parsedCart })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('brandson_ecommerce_cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product: Product, variant: ProductVariant, quantity: number = 1) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { product, variant, quantity }
    })
  }

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id, quantity }
    })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const setShipping = (shipping: ShippingInfo) => {
    dispatch({ type: 'SET_SHIPPING', payload: shipping })
  }

  const isInCart = (productId: string, variantId?: string): boolean => {
    if (variantId) {
      return cart.items.some(item => item.product.id === productId && item.variant.id === variantId)
    }
    return cart.items.some(item => item.product.id === productId)
  }

  const getItemQuantity = (productId: string, variantId?: string): number => {
    if (variantId) {
      const item = cart.items.find(item => item.product.id === productId && item.variant.id === variantId)
      return item ? item.quantity : 0
    }
    return cart.items
      .filter(item => item.product.id === productId)
      .reduce((sum, item) => sum + item.quantity, 0)
  }

  const getShippingOptions = (): ShippingInfo[] => {
    return SHIPPING_OPTIONS
  }

  const calculateShipping = (items: CartItem[], method: string): number => {
    const shippingOption = SHIPPING_OPTIONS.find(option => option.method === method)
    return shippingOption ? shippingOption.cost : 0
  }

  const createOrderSummary = (
    customerInfo: CustomerInfo,
    shippingMethod: string,
    paymentMethod: string,
    orderNotes?: string
  ): OrderSummary => {
    const shippingOption = SHIPPING_OPTIONS.find(option => option.method === shippingMethod)
    
    return {
      items: cart.items,
      subtotal: cart.subtotal,
      tax: cart.tax,
      shipping: cart.shipping,
      total: cart.total,
      customerInfo,
      shippingInfo: shippingOption || SHIPPING_OPTIONS[0],
      paymentMethod,
      orderNotes
    }
  }

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setShipping,
    isInCart,
    getItemQuantity,
    getShippingOptions,
    calculateShipping,
    createOrderSummary
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
