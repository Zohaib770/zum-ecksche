import { useEffect, useState, useCallback, useRef } from 'react';
import { Order } from '../../types/Interfaces';
import Apis from '../../api/Apis';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import socketIOClient from 'socket.io-client';

const OrderManagement = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedOrders = await Apis.fetchOrder();
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Fehler beim Laden der Bestellungen:', error);
      toast.error('Bestellungen konnten nicht geladen werden');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const allowAudioPlayback = (ref: React.RefObject<HTMLAudioElement>) => {
    const attemptPlay = () => {
      ref.current?.play()
        .then(() => {
          ref.current?.pause();
          ref.current.currentTime = 0;
        })
        .catch(console.warn);
      window.removeEventListener("click", attemptPlay);
    };
  
    window.addEventListener("click", attemptPlay);
  };

  const handleNewOrder = (newOrder: Order) => {
    toast.info(`Neue Bestellung von ${newOrder.personalDetail?.fullName}`);
    setOrders(prev => [newOrder, ...prev]);

    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.error("Audio konnte nicht abgespielt werden:", err);
      });
    }
  };

  useEffect(() => {
    (async () => {
      await fetchOrders();
    })();

    const socket = socketIOClient(import.meta.env.VITE_API_BASE_URL);
    socket.on('newOrder', handleNewOrder);
    allowAudioPlayback(audioRef as React.RefObject<HTMLAudioElement>);

    return () => {
      socket.off('newOrder', handleNewOrder);
      socket.disconnect();
    };

    // return () => {
    //   socket.disconnect();
    // };
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await Apis.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success('Bestellstatus aktualisiert');
    } catch (error) {
      console.error('Fehler beim Aktualisieren:', error);
      toast.error('Status konnte nicht aktualisiert werden');
    }
  };

  const toggleDetails = (id: number) => {
    setExpandedOrderId(prev => (prev === id ? null : id));
  };

  const calculateTotal = (order: Order): string => {
    return order.cartItem.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) return <div className="text-center p-8">Lade Bestellungen...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border h-full">
      <h3 className="text-lg font-semibold mb-4">Aktive Bestellungen</h3>

      {orders.length === 0 ? (
        <p className="text-gray-500">Keine Bestellungen vorhanden</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const isExpanded = expandedOrderId === order._id;
            return (
              <div
                key={order._id}
                className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleDetails(order._id!)}
              >
                {/* Kompakte Vorschau */}
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">
                      {order.personalDetail.fullName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {order.cartItem[0]?.name}...
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{calculateTotal(order)} €</p>
                    <span className={`px-2 py-1 rounded text-xs ${order.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Detailansicht */}
                {isExpanded && (
                  <div className="mt-4 border-t pt-4 text-sm">
                    <p className="text-gray-600">
                      {order.personalDetail.phone} • {order.personalDetail.email}
                    </p>
                    {order.deliveryAddress && (
                      <p className="mt-1">
                        {order.deliveryAddress.street}, {order.deliveryAddress.postalCode} {order.deliveryAddress.city}
                      </p>
                    )}

                    <ul className="list-disc list-inside mt-2">
                      {order.cartItem.map((item, i) => (
                        <li key={i}>
                          {item.name} - {item.price}€
                          {item.options?.map(opt => (
                            <span key={opt.name} className="ml-2 text-xs text-gray-500">
                              {opt.name}: {opt.values?.map(v => v.value).join(', ')}
                            </span>
                          ))}
                          {item.comment && (
                            <span className="ml-2 text-xs text-gray-500">({item.comment})</span>
                          )}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-3 flex space-x-2">
                      {order.status !== 'completed' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); updateOrderStatus(order._id!, 'completed'); }}
                          className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Als erledigt
                        </button>
                      )}
                      {order.status !== 'cancelled' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); updateOrderStatus(order._id!, 'cancelled'); }}
                          className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Stornieren
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); handlePrint(); }}
                        className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Drucken
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <audio ref={audioRef} src="/sounds/new-order.mp3" preload="auto" />
    </div>
  );
};

export default OrderManagement;
