import { createContext, useContext, useEffect, useReducer } from "react";
import { CartReducer, initialState } from "../reducer/CartReducer";
import { getCart } from "../services/CartService";

const CartContext = createContext();

export const CartProvider = ({children}) => {
    const [state,dispatch] = useReducer(CartReducer,initialState);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if(userId) {
            fetchCart();
        }
    },[userId]);

    const fetchCart = async () => {
        try {
            const res = await getCart(userId);
            dispatch({type:"SET_CART",payload:res.data});
        }
        catch (err){
            console.error("Error fetching cart",err);
        };
    };

        const cartCount = state.cartItems.length;

        return (
            <CartContext.Provider value ={{cartItems:state.cartItems,
                cartCount,
                fetchCart,
                dispatch
            }}>
                {children}
            </CartContext.Provider>
        )
    };
    
export const useCart = () => {
        return useContext(CartContext);
};