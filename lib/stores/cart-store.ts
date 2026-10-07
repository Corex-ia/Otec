import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, CartCourseItem, CartTicketItem } from '@/types';

interface CartStore {
  items: CartItem[];
  addCourse: (course: Omit<CartCourseItem, 'type' | 'quantity'>) => void;
  addTicket: (ticket: Omit<CartTicketItem, 'type'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addCourse: (course) => {
        const existingItem = get().items.find(
          (item) => item.type === 'course' && item.id === course.id
        );

        if (existingItem) {
          return;
        }

        set((state) => ({
          items: [
            ...state.items,
            {
              ...course,
              type: 'course',
              quantity: 1,
            } as CartCourseItem,
          ],
        }));
      },

      addTicket: (ticket) => {
        set((state) => ({
          items: [
            ...state.items,
            {
              ...ticket,
              type: 'ticket',
            } as CartTicketItem,
          ],
        }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'otec-cart-storage',
    }
  )
);
