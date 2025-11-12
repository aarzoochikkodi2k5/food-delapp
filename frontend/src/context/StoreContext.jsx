import { createContext, useState } from "react";
import { food_list as foodData } from "../assets/assets.js";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list] = useState(foodData); // use static data

  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const newCart = { ...prev };
      if (newCart[itemId] === 1) delete newCart[itemId];
      else if (newCart[itemId] > 1) newCart[itemId] -= 1;
      return newCart;
    });
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  return (
    <StoreContext.Provider
      value={{ food_list, cartItems, addToCart, removeFromCart, getTotalCartAmount }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;

