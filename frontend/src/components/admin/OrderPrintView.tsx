import React from 'react';
import { Order } from '../../types/Interfaces';

interface Props {
    order: Order;
}

const OrderPrintView = React.forwardRef<HTMLDivElement, Props>(({ order }, ref) => {
    const calculateTotal = (): string => {
        return order.cartItem.reduce((sum, item) => sum + item.price, 0).toFixed(2);
    };

    return (
        <div ref={ref} className="print-area text-xs">
            <h2 className="font-bold text-base mb-2">Zum Ecksche</h2>
            <h2 className="font-bold text-base mb-2">Bestellung</h2>
            <p className="mb-1">Name: {order.personalDetail.fullName}</p>
            <p className="mb-1">Telefon: {order.personalDetail.phone}</p>
            <p className="mb-1">E-Mail: {order.personalDetail.email}</p>
            {order.deliveryAddress && (
                <p className="mb-2">
                    Adresse: {order.deliveryAddress.street}, {order.deliveryAddress.postalCode} {order.deliveryAddress.city}
                </p>
            )}

            <ul className="mb-2">
                {order.cartItem.map((item, i) => (
                    <li key={i} className="mb-1">
                        {item.name} - {item.price}€
                        {item.options?.map(opt => (
                            <div key={opt.name} className="ml-2 text-gray-600 text-xs">
                                {opt.name}: {opt.values?.map(v => v.value).join(', ')}
                            </div>
                        ))}
                        {item.comment && (
                            <div className="ml-2 text-gray-600 text-xs">(Kommentar: {item.comment})</div>
                        )}
                    </li>
                ))}
            </ul>

            <p className="font-bold">Gesamt: {calculateTotal()} €</p>
        </div>
    );
});

export default OrderPrintView;
