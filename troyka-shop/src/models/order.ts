export interface Order {
    id: number
    stripeId?: string
    products: string
    paymentMethod: string
    orderId: string
    status: string
    addressInfo: string
    user?: string | null
    totalPrice: number
    isPaid: boolean
}