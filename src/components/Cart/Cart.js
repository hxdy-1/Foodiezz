import React, { useContext, useState } from "react";

import Modal from "../UI/Modal";
import CartItem from "./CartItem";
import classes from "./Cart.module.css";
import CartContext from "../../store/cart-context";
import Checkout from "./Checkout";

const Cart = (props) => {
    const [isCheckout, setIsCheckout] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [didSubmit, setDidSubmit] = useState(false);

    const cartCtx = useContext(CartContext);

    const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
    const hasItems = cartCtx.items.length > 0;

    const cartItemRemoveHandler = (id) => {
        cartCtx.removeItem(id);
    };

    const cartItemAddHandler = (item) => {
        cartCtx.addItem(item);
    };

    const orderHandler = (e) => {
        setIsCheckout(true);
    };

    const onSubmitHandler = async (userData) => {
        setIsSubmitting(true);
        await fetch(
            "https://foodiezz-dff0d-default-rtdb.firebaseio.com/orders.json",
            {
                method: "POST",
                body: JSON.stringify({
                    users: userData,
                    orderedItems: cartCtx.items,
                }),
            }
        );

        setIsSubmitting(false);
        setDidSubmit(true);
        cartCtx.clearCart();
    };

    const cartItems = (
        <ul className={classes["cart-items"]}>
            {cartCtx.items.map((item) => (
                <CartItem
                    key={item.id}
                    name={item.name}
                    amount={item.amount}
                    price={item.price}
                    onRemove={cartItemRemoveHandler.bind(null, item.id)}
                    onAdd={cartItemAddHandler.bind(null, item)}
                />
            ))}
        </ul>
    );

    const modalsActions = (
        <div className={classes.actions}>
            <button className={classes["button--alt"]} onClick={props.onClose}>
                Close
            </button>
            {hasItems && (
                <button className={classes.button} onClick={orderHandler}>
                    Order
                </button>
            )}
        </div>
    );

    const cartModalCnt = (
        <>
            {cartItems}
            <div className={classes.total}>
                <span>Total Amount</span>
                <span>{totalAmount}</span>
            </div>
            {isCheckout && (
                <Checkout
                    onConfirm={onSubmitHandler}
                    onCancel={props.onClose}
                />
            )}
            {!isCheckout && modalsActions}
        </>
    );

    const isSubmittingCnt = <p>Placing the order...</p>;

    const didSubmitCnt = (
        <>
            <p>Order placed successfully!</p>
            <div className={classes.actions}>
                <button
                    className={classes["button--alt"]}
                    onClick={props.onClose}
                >
                    Close
                </button>
            </div>
        </>
    );

    return (
        <Modal onClose={props.onClose}>
            {!isSubmitting && !didSubmit && cartModalCnt}
            {isSubmitting && isSubmittingCnt}
            {didSubmit && !isSubmitting && didSubmitCnt}
        </Modal>
    );
};

export default Cart;
