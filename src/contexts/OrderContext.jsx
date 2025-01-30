// src/contexts/OrderContext.jsx
import { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orderInfo, setOrderInfo] = useState({
    type: null, // 'delivery', 'reservation', 'table'
    deliveryInfo: null,
    reservationInfo: null,
    takeawayInfo: null,
    tableInfo: null,
    paymentInfo: null,
    status: 'pending', // 'pending', 'confirmed', 'completed', 'cancelled'
  });

  const updateOrderInfo = (newInfo) => {
    setOrderInfo((prev) => ({
      ...prev,
      ...newInfo,
    }));
  };

  return (
    <OrderContext.Provider value={{ orderInfo, updateOrderInfo }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrder = () => useContext(OrderContext);