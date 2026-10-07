'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/lib/stores/cart-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const items = useCartStore((state) => state.items);
  const addCourse = useCartStore((state) => state.addCourse);
  const removeItem = useCartStore((state) => state.removeItem);

  // Recibe el carrito enviado desde el sitio corporativo
  // (`?items=<base64 json>`) y lo agrega al carrito local.
  useEffect(() => {
    const encoded = searchParams.get('items');
    if (!encoded) return;

    try {
      const incoming = JSON.parse(atob(decodeURIComponent(encoded))) as Array<{
        type: 'course';
        id: string;
        title: string;
        price: number;
      }>;

      incoming
        .filter((item) => item.type === 'course')
        .forEach((item) => addCourse({ id: item.id, title: item.title, price: item.price }));
    } catch {
      toast.error('No se pudo cargar el carrito recibido');
    } finally {
      router.replace('/checkout');
    }
  }, [searchParams, addCourse, router]);
  const getTotal = useCartStore((state) => state.getTotal);
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useAuthStore((state) => state.user);

  const handleCheckout = async () => {
    if (!user) {
      router.push('/auth/login?redirect=/checkout');
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login?redirect=/checkout');
        return;
      }

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const returnUrl = `${window.location.origin}/api/checkout/webpay-return`;

      const response = await fetch(`${supabaseUrl}/functions/v1/webpay-create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ items, returnUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo crear la orden');
      }

      if (data.url && data.token) {
        // Webpay requires a POST with token_ws to its redirect URL.
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.url;

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'token_ws';
        input.value = data.token;

        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
      } else {
        throw new Error('No se pudo crear la orden');
      }
    } catch (error) {
      toast.error('Error al procesar el pago');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <CardTitle>Carrito vacío</CardTitle>
            <CardDescription>No tienes productos en tu carrito</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button onClick={() => router.push('/cursos')}>
              Explorar cursos
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const total = getTotal();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Carrito de compras</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 pb-4 border-b last:border-0">
                    {item.type === 'course' && item.image_url && (
                      <div className="relative h-20 w-32 flex-shrink-0 rounded overflow-hidden">
                        <Image
                          src={item.image_url}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {item.type === 'course' ? item.title : item.eventTitle}
                      </h3>
                      {item.type === 'ticket' && item.sectionName && (
                        <p className="text-sm text-muted-foreground">
                          {item.sectionName}
                          {item.seatNumber && ` - Asiento ${item.seatNumber}`}
                        </p>
                      )}
                      <p className="text-sm font-semibold mt-1">
                        ${item.price.toLocaleString()} x {item.quantity}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? 'Procesando...' : 'Proceder al pago'}
                </Button>

                {!user && (
                  <p className="text-xs text-muted-foreground text-center">
                    Necesitas iniciar sesión para completar la compra
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
