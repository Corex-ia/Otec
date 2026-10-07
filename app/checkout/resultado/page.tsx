'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCartStore } from '@/lib/stores/cart-store';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function CheckoutResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const clearCart = useCartStore((state) => state.clearCart);

  const success = status === 'success';

  useEffect(() => {
    if (success) clearCart();
  }, [success, clearCart]);

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-lg mx-auto text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            {success ? (
              <CheckCircle2 className="h-16 w-16" style={{ color: '#0B2E5B' }} />
            ) : (
              <XCircle className="h-16 w-16" style={{ color: '#F36C21' }} />
            )}
          </div>
          <CardTitle>{success ? '¡Pago exitoso!' : 'No se pudo completar el pago'}</CardTitle>
          <CardDescription>
            {success
              ? 'Tu compra fue confirmada y el acceso a tu curso ya está disponible.'
              : 'La transacción fue rechazada o cancelada. No se realizó ningún cargo.'}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center gap-3">
          {success ? (
            <Button style={{ backgroundColor: '#0B2E5B' }} onClick={() => router.push('/dashboard')}>
              Ir a mis cursos
            </Button>
          ) : (
            <Button style={{ backgroundColor: '#F36C21' }} onClick={() => router.push('/checkout')}>
              Volver al checkout
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
