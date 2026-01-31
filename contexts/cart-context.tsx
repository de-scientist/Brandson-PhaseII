"use client"

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'

export interface CartItem {
  id: string
  service: string
  category: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
  specifications?: Record<string, any>
  timeline?: string
  image?: string
}

interface CartState {
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  itemCount: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState }

const initialState: CartState = {
  items: [],
  subtotal: 0,
  tax: 0,
  total: 0,
  itemCount: 0,
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      if (existingItem) {
        // Update quantity if item exists
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        )
        return calculateTotals({ ...state, items: updatedItems })
      } else {
        // Add new item
        const newItems = [...state.items, action.payload]
        return calculateTotals({ ...state, items: newItems })
      }
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload)
      return calculateTotals({ ...state, items: newItems })
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload
      if (quantity <= 0) {
        const newItems = state.items.filter(item => item.id !== id)
        return calculateTotals({ ...state, items: newItems })
      }
      
      const newItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
      return calculateTotals({ ...state, items: newItems })
    }
    
    case 'CLEAR_CART':
      return initialState
    
    case 'LOAD_CART':
      return action.payload
    
    default:
      return state
  }
}

function calculateTotals(state: CartState): CartState {
  const subtotal = state.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
  const tax = subtotal * 0.16 // 16% tax
  const total = subtotal + tax
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)
  
  return {
    ...state,
    subtotal,
    tax,
    total,
    itemCount,
  }
}

interface CartContextType {
  cart: CartState
  addToCart: (item: Omit<CartItem, 'totalPrice'>) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  isInCart: (id: string) => boolean
  getItemQuantity: (id: string) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('brandson_cart')
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart)
          dispatch({ type: 'LOAD_CART', payload: parsedCart })
        }
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('brandson_cart', JSON.stringify(cart))
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error)
      }
    }
  }, [cart])

  const addToCart = (item: Omit<CartItem, 'totalPrice'>) => {
    const cartItem: CartItem = {
      ...item,
      totalPrice: item.unitPrice * item.quantity,
    }
    dispatch({ type: 'ADD_ITEM', payload: cartItem })
  }

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const isInCart = (id: string) => {
    return cart.items.some(item => item.id === id)
  }

  const getItemQuantity = (id: string) => {
    const item = cart.items.find(item => item.id === id)
    return item?.quantity || 0
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
