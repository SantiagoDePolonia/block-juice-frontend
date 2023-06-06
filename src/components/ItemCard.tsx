import { StoreItem, CartType } from "./App";
import QuantityButton from "./QuantityButton";

import './ItemCard.css';
import { useCallback } from "react";

interface ItemCardProps {
  item: StoreItem;
  cart: CartType;
  incrementItem: (itemId: string) => void;
  decrementItem: (itemId: string) => void;
}

function ItemCard({item, cart, incrementItem, decrementItem}: ItemCardProps) {

  const handleIncrementItem = useCallback(() => {
    incrementItem(item.id);
  }, [item.id, incrementItem]);

  const handleDecrementItem = useCallback(() => {
    decrementItem(item.id);
  }, [item.id, decrementItem]);

  return (
  <div className="item" key={item.id}>
  <div className='item-image'>
    <img src={item.imageURL} alt={item.name} className='img-responsive' />
  </div>
  <div className="item-details-container">
    <div className="item-header-row">
      <h4 className="item-name">{item.name}</h4>
      <span className="item-price-usd">${item.priceUSD}</span>
    </div>
    <div className="item-subheader-row">
      <div className="item-size">{item.size}</div>
      <span className="item-price-eth">~{item.priceETH} ETH</span>
    </div>
    <div className="item-actions">
      <QuantityButton onClick={handleIncrementItem}>
        <img src="/icons/plus.png" alt="+" />
      </QuantityButton>
      {!!cart[item.id] && (
        <>
          <QuantityButton onClick={handleDecrementItem}>
            <img src="/icons/minus.png" alt="-" />
          </QuantityButton>
          <input type="text" className="item-quantity" value={cart[item.id].quantity} readOnly />
        </>
      )}
    </div>
  </div>
</div>);
}

export default ItemCard;