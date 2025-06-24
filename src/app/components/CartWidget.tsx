import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from '../../lib/hooks/useCart';
import { useAuthContext } from '../../lib/contexts/AuthContext';
import type { CartItemResponse } from '../../lib/types/Cart';

export default function CartWidget() {
  const { cart, isPendingCart } = useCart();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Cerrar el dropdown cuando el usuario cierra sesión
  useEffect(() => {
    if (!user) {
      setIsOpen(false);
    }
  }, [user]);

  // Solo mostrar si el usuario está autenticado
  if (!user) return null;

  const itemCount = cart?.items?.length || 0;
  const totalPrice = cart?.total_price || 0;

  const handleViewCart = () => {
    setIsOpen(false);
    navigate('/cart');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
        </svg>
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>

      {/* Dropdown del carrito */}
      {isOpen && (
        <>
          {/* Overlay para cerrar al hacer clic fuera */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">Carrito de Compras</h3>
              
              {isPendingCart ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">Cargando carrito...</p>
                </div>
              ) : itemCount === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">Tu carrito está vacío</p>
                </div>
              ) : (
                <>
                  <div className="max-h-64 overflow-y-auto space-y-3">
                    {cart?.items?.map((item: CartItemResponse) => (
                      <div key={item.article_id} className="flex justify-between items-center border-b pb-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-gray-500 text-xs">
                            {item.quantity} x ${item.price}
                          </p>
                        </div>
                        <p className="font-semibold text-sm">${item.total}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold">Total:</span>
                      <span className="font-bold text-lg">${totalPrice}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <button
                        onClick={handleViewCart}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-sm"
                      >
                        Ver Carrito
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
} 