// Initial state
export const initialState = {
    cartItems: []
};

export const CartReducer = (state,action) => {
    switch (action.type) {
        case "SET_CART" :
            return {
                ...state,cartItems: action.payload
            };
        
            case "ADD_ITEM":
                return {
                    ...state,
                    cartItems:[...state.cartItems,action.payload]
                };
            case "REMOVE_ITEM":
                return {
                    ...state,
                    cartItems:state.cartItems.filter(
                        item => item.id !== action.payload
                    )
                };
            
            case "UPDATE_QTY":
                return {
                    ...state,
                    cartItems:state.cartItems.map(item =>
                        item.id === action.payload.cartId 
                        ? {...item, quantity:action.payload.quantity}
                        :item
                    )
                };
            
            case "CLEAR_CART":
                return {...state,cartItems:[]};
            
            default:
                return state;

    }
};