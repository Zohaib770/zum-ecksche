import { useEffect, useState, useCallback, useRef } from 'react';
import { Order } from '../../types/Interfaces';
import Apis from '../../api/Apis';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import socketIOClient from 'socket.io-client';
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
  // const [printOrder, setPrintOrder] = useState<Order | null>(null);
  const [dateFilter, setDateFilter] = useState<'today' | 'all' | 'custom'>('today');
  const [customDate, setCustomDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  // Calculate total revenue for filtered orders
  const totalRevenue = filteredOrders.reduce((sum, order) => {
    return sum + order.cartItem.reduce((orderSum, item) => orderSum + (item.price * item.quantity), 0);
  }, 0);

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
    let filtered: Order[];
    if (filterType === 'today') {
      filtered = ordersToFilter.filter(order => isToday(parseISO(order.createdAt)));
    } else if (filterType === 'all') {
      filtered = ordersToFilter;
    } else {
      filtered = ordersToFilter.filter(order =>
        format(parseISO(order.createdAt), 'yyyy-MM-dd') === selectedDate
      );
    }
    setFilteredOrders(filtered);
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

  const handlePrint = async (order: Order) => {
    try {
      const epson = (window as any).epson;

      if (!epson || !epson.ePOSDevice) {
        throw new Error("Epson SDK not loaded or ePOSDevice missing.");
      }

      const device = new epson.ePOSDevice();
      const printerIp = import.meta.env.VITE_PRINTER_IP; // e.g., 'tcp://192.168.2.178:9100'
      const port = 9100; //8008

      if (!printerIp) {
        throw new Error("Printer IP not set in .env");
      }

      // Show "Connecting..." toast
      toast.info("Connecting to printer...");

      device.connect(
        printerIp,
        false,
        (resultConnect: number) => {
          if (resultConnect === 0) {
            toast.success("Printer connected!");
            
            device.createDevice(
              'local_printer',
              epson.ePOSDevice.DEVICE_TYPE_PRINTER,
              { crypto: false, buffer: false },
              (devObj: any, code: string) => {
                if (code === 'OK') {
                  toast.success("Printer device ready – no print job sent (test only)");
                  const printer = devObj;
                  printer.onerror = (error: any) => {
                    toast.error(`Printer error: ${error.message || error}`);
                  };

                  // Configure printer for Western characters
                  printer.addTextFont(epson.ePOSDevice.FONT_A);
                  printer.addTextLang('en');
                  printer.addTextSmooth(true);

                  printer.addText("Hallo Welt!\n");
                  printer.addCut();
                  printer.send();
                  toast.success("Print job sent!");
                } else {
                  toast.error(`Printer setup failed (Code: ${code}). Check IP/port.`);
                }
              }
            );
          } else {
            const errorMessages: Record<number, string> = {
              1: "Timeout – Printer may be offline.",
              2: "Invalid parameters (check IP).",
              3: "Network issue (unreachable IP).",
              4: "Port not open (check firewall).",
              8: "Printer malfunction.",
            };
            const message = errorMessages[resultConnect] || `Connection failed (Code: ${resultConnect})`;
            toast.error(message);
          }
        });

    } catch (error) {
      toast.error(`Printing failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const formatOrderDate = (dateString: string) => {
    return format(parseISO(dateString), 'PPpp', { locale: de });
  };

  const getFilterDescription = () => {
    switch (dateFilter) {
      case 'today':
        return 'Heutige Bestellungen';
      case 'all':
        return 'Alle Bestellungen';
      case 'custom':
        return `Bestellungen vom ${format(parseISO(customDate), 'PPP', { locale: de })}`;
      default:
        return 'Bestellungen';
    }
  };

  if (isLoading) return <div className="text-center p-8">Lade Bestellungen...</div>;

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border h-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold">Bestellverwaltung</h3>
          <p className="text-sm text-gray-500">{getFilterDescription()}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Filter:</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as 'today' | 'all' | 'custom')}
              className="border rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="border rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Revenue summary */}
      <div className="bg-blue-50 p-3 rounded-lg mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <div className="text-center">
              <p className="text-sm text-gray-500">Gesamte Bestellungen</p>
              <p className="font-medium">{filteredOrders.length}</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">Gesamtumsatz</h4>
            <p className="text-2xl font-bold text-blue-600">
              {convertPriceFromDotToComma(totalRevenue)} €
            </p>
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Keine Bestellungen vorhanden</p>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map(order => {
            const isExpanded = expandedOrderId === order._id;
            return (
              <div
                key={order._id}
                className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleDetails(order._id!)}
              >
                {/* className="mt-3 border-t pb-3 text-sm" */}
                {isExpanded && (
                  <div className="mb-3 border-b pb-3 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium mb-2">Kundendaten</h5>
                        <div className="space-y-1">
                          <p>{order.personalDetail.fullName}</p>
                          <p>{order.personalDetail.phone}</p>
                          <p>{order.personalDetail.email}</p>
                          {order.deliveryAddress && (
                            <div className="mt-2 space-y-1">
                              <p className="font-medium">Lieferadresse:</p>
                              <p>{order.deliveryAddress.street}</p>
                              <p>{order.deliveryAddress.postalCode} {order.deliveryAddress.city}</p>
                              {order.deliveryAddress?.floor && (
                                <p>Etage: {order.deliveryAddress.floor}</p>
                              )}
                              {order.deliveryAddress?.comment && (
                                <p className="text-gray-600">Anmerkung: {order.deliveryAddress.comment}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Bestelldetails</h5>
                        <ul className="space-y-3">
                          {order.cartItem.map((item, i) => (
                            <li key={i} className="border-b pb-2 last:border-0">
                              <div className="flex justify-between">
                                <span>
                                  {item.quantity} x {item.name}
                                </span>
                                <span className="font-medium">
                                  {convertPriceFromDotToComma(item.price * item.quantity)}€
                                </span>
                              </div>
                              {item.options?.map((opt) => (
                                <div key={opt.name} className="ml-2 text-sm text-gray-600">
                                  • {opt.name}: {opt.values?.map(v => v.value).join(', ')}
                                </div>
                              ))}
                              {item.comment && (
                                <div className="ml-2 text-sm text-gray-500 italic">
                                  • Hinweis: {item.comment}
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {order.status !== 'completed' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); updateOrderStatus(order._id!, 'completed'); }}
                          className="text-sm bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                        >
                          Als erledigt markieren
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrint(order);
                        }}
                        className="text-sm bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                      >
                        Drucken
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium truncate">
                        {order.personalDetail.fullName}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {/* Payment Method (Bar / Online) */}
                        {order.paymentMethod && (
                          <span className={`text-xs px-2 py-0.5 rounded 
                            ${order.paymentMethod === 'cash'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.paymentMethod === 'online'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'}`}>
                            {order.paymentMethod === 'cash' ? 'Barzahlung' :
                              order.paymentMethod === 'online' ? 'Online-Zahlung' :
                                order.paymentMethod}
                          </span>
                        )}
                        {/* Order Type (Lieferung / Abholung) */}
                        {order.orderType && (
                          <span className={`text-xs px-2 py-0.5 rounded 
                              ${order.orderType === 'delivery'
                              ? 'bg-red-100 text-red-800'
                              : order.orderType === 'pickup'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'}`}>
                            {order.orderType === 'delivery' ? 'Lieferung' :
                              order.orderType === 'pickup' ? 'Abholung' :
                                order.orderType}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {order.cartItem.length} Artikel • {order.cartItem[0]?.name}...
                    </p>
                    <p className="text-xs mt-1">
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

              </div>
            );
          })}
        </div>
      )
      }
      <audio ref={audioRef} src="/sounds/new-order.mp3" preload="auto" />
    </div>
  );
};

export default OrderManagement;