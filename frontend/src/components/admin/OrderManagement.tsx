import { useEffect, useState, useCallback, useRef } from 'react';
import { Order } from '../../types/Interfaces';
import Apis from '../../api/Apis';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import socketIOClient from 'socket.io-client';
import OrderPrintView from './OrderPrintView';
import { format, isToday, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { convertPriceFromDotToComma } from '../../utils/helpFunctions';

const OrderManagement = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const [printOrder, setPrintOrder] = useState<Order | null>(null);
  const [dateFilter, setDateFilter] = useState<'today' | 'all' | 'custom'>('today');
  const [customDate, setCustomDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedOrders = await Apis.fetchOrder();
      const sortedOrders = [...fetchedOrders].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sortedOrders);
      filterOrders(fetchedOrders, dateFilter, customDate);
    } catch (error) {
      console.error('Fehler beim Laden der Bestellungen:', error);
      toast.error('Bestellungen konnten nicht geladen werden');
    } finally {
      setIsLoading(false);
    }
  }, [dateFilter, customDate]);

  const filterOrders = (ordersToFilter: Order[], filterType: string, selectedDate: string) => {
    if (filterType === 'today') {
      const todayOrders = ordersToFilter.filter(order =>
        isToday(parseISO(order.createdAt))
      );
      setFilteredOrders(todayOrders);
    } else if (filterType === 'all') {
      setFilteredOrders(ordersToFilter);
    } else {
      // Custom date filter
      const filtered = ordersToFilter.filter(order =>
        format(parseISO(order.createdAt), 'yyyy-MM-dd') === selectedDate
      );
      setFilteredOrders(filtered);
    }
  };

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
    filterOrders([newOrder, ...orders], dateFilter, customDate);

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

    const socket = socketIOClient(import.meta.env.VITE_BACKEND_URL);
    socket.on('newOrder', handleNewOrder);
    allowAudioPlayback(audioRef as React.RefObject<HTMLAudioElement>);

    return () => {
      socket.off('newOrder', handleNewOrder);
      socket.disconnect();
    };
  }, [fetchOrders]);

  useEffect(() => {
    filterOrders(orders, dateFilter, customDate);
  }, [dateFilter, customDate, orders]);

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

  const calculateTotal = (order: Order): number => {
    return order.cartItem.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handlePrint = (order: Order) => {
    setPrintOrder(order);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const formatOrderDate = (dateString: string) => {
    return format(parseISO(dateString), 'PPpp', { locale: de });
  };

  if (isLoading) return <div className="text-center p-8">Lade Bestellungen...</div>;

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border h-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h3 className="text-lg font-semibold">Bestellverwaltung</h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Filter:</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as 'today' | 'all')}
              className="border rounded p-1 text-sm"
            >
              <option value="today">Heute</option>
              <option value="all">Alle</option>
              <option value="custom">Datum auswählen</option>
            </select>
          </div>

          {dateFilter === 'custom' && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Datum:</label>
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="border rounded p-1 text-sm"
              />
            </div>
          )}
        </div>
      </div>

      {printOrder && (
        <div className="hidden print:block">
          <OrderPrintView ref={printRef} order={printOrder} />
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Keine Bestellungen vorhanden</p>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map(order => {
            const isExpanded = expandedOrderId === order._id;
            return (
              <div
                key={order._id}
                className="border rounded-lg p-3 md:p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleDetails(order._id!)}
              >
                <div className="flex flex-col sm:flex-row justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">
                      {order.personalDetail.fullName}
                    </h4>
                    <p className="text-sm text-gray-600 truncate">
                      {order.cartItem[0]?.name}...
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatOrderDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-sm font-medium whitespace-nowrap">
                      {convertPriceFromDotToComma(calculateTotal(order))} €
                    </p>
                    <span className={`px-2 py-0.5 rounded text-xs mt-1 ${order.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-3 border-t pt-3 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-700">Kundendaten</h5>
                        <p>{order.personalDetail.fullName}</p>
                        <p>{order.personalDetail.phone}</p>
                        <p>{order.personalDetail.email}</p>
                        {order.deliveryAddress && (
                          <p className="mt-1">
                            <p>Strasse: {order.deliveryAddress.street}</p>
                            <p>Stadt: {order.deliveryAddress.postalCode} {order.deliveryAddress.city}</p>
                            {order.deliveryAddress?.floor &&
                              <p> Etage: {order.deliveryAddress?.floor}</p>}
                              {order.deliveryAddress?.comment &&
                            <p>Anmerkung: {order.deliveryAddress?.comment}</p>}
                          </p>
                        )}
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-700">Bestelldetails</h5>
                        <ul className="list-disc list-inside">
                          {order.cartItem.map((item, i) => (
                            <li key={i} className="mb-2">
                              {item.quantity} x {item.name} - {convertPriceFromDotToComma(item.price * item.quantity)}€
                              {item.options?.map((opt) => (
                                <div key={opt.name} className="ml-4 text-sm text-gray-600">
                                  • {opt.name}: {opt.values?.map(v => v.value).join(', ')}
                                </div>
                              ))}
                              {item.comment && (
                                <div className="ml-4 text-sm text-gray-500 italic">
                                  • Hinweis: {item.comment}
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {order.status !== 'completed' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); updateOrderStatus(order._id!, 'completed'); }}
                          className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Als erledigt
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); handlePrint(order); }}
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