import banner from '/banner.png'
import './App.css'
import { useEffect, useState } from 'react';
import ItemCard from './ItemCard';
import Section from './Section';
import EmptyCartContent from './EmptyCartContent';

export interface StoreItem {
  id: string;
  name: string;
  imageURL: string;
  priceETH: string;
  priceUSD: string;
  size: string; // size/portion
}

export type CartType = Record<string, {quantity:number}>;

const DEMO_ITEMS: StoreItem[] = [
  {
    id: "1", name: "Apple", priceETH: "0.0001", priceUSD: "1.23", size: "500 ml", imageURL: '/items/apple.png'
  },
  {
    id: "2", name: "Cherry", priceETH: "0.0002", priceUSD: "2.23", size: "500 ml", imageURL: '/items/cherry.png',
  },
  {
    id: "3", name: "Kiwi + Mint", priceETH: "0.0012", priceUSD: "3.23", size: "500 ml", imageURL: '/items/kiwi_mint.png',
  },
  {
    id: "4", name: "Orange", priceETH: "0.0012", priceUSD: "3.00", size: "500 ml", imageURL: '/items/orange.png',
  }
];

function App() {
  const [items, setItems]= useState(DEMO_ITEMS);
  const [cart, setCart]= useState<CartType>({});

  const [totalPriceUSD, setTotalPriceUSD] = useState('1.00');
  const [totalPriceETH, setTotalPriceETH] = useState('1.00');
  // Note: It should runs only once at prod.
  // It might runs multiple times at dev.
  useEffect(() => {
    // TODO: fetch items from server

    // setItems() ...
  }, []);

  // Note: It calculates total ETH and USD price on every cart change.
  useEffect(() => {
    const totalPriceUSDTemp = Object.keys(cart).reduce((acc, itemId) => {
      const item = items.find((item) => item.id === itemId);
      if(!item) return acc;
      
      return acc + (Number(item.priceUSD) * cart[itemId].quantity);
    }, 0);
    const totalPriceETHTemp = Object.keys(cart).reduce((acc, itemId) => {
      const item = items.find((item) => item.id === itemId);
      if(!item) return acc;
      
      return acc + (Number(item.priceETH) * cart[itemId].quantity);
    }, 0);

    setTotalPriceETH(String(totalPriceETHTemp.toFixed(6)))
    setTotalPriceUSD(String(totalPriceUSDTemp.toFixed(2)))
  }, [cart, setTotalPriceETH, setTotalPriceUSD, items]);

  const incrementItem = (itemId: string) => {
    setCart((cart) => {
      const newCart = {...cart};
      if(!newCart[itemId]) {
        newCart[itemId] = {quantity: 1};
      } else {
        newCart[itemId] = {quantity: newCart[itemId].quantity + 1};
      }
      return newCart;
    });

  }

  const decrementItem = (itemId: string) => {
    if(cart[itemId].quantity === 1) return removeItem(itemId)

    setCart((cart) => {
      const newCart = {...cart};
      newCart[itemId] = { quantity: newCart[itemId].quantity - 1};
      return newCart;
    });
  
  }

  const removeItem = (itemId:string) => {
    setCart((cart) => {
      const newCart = {...cart};
      delete newCart[itemId];
      return newCart;
    });
  }

  return (
    <>
      <div>
        <img src={banner} alt="BlockJuice - logo" className="banner" />
      </div>
      <Section title={'Choose Juice'}>
        <div className="items-list">
          {items.map((item) => (
            <ItemCard item={item} cart={cart} key={item.id}
              incrementItem={incrementItem}
              decrementItem={decrementItem}
            />
          ))}
        </div>
      </Section>
      <Section title={'My Order'}>
        <div className='cart-box'>
          {Object.keys(cart).length === 0 ? 
            <EmptyCartContent /> : null
          }
        </div>
      </Section>

      {/* TODO: Total section */}
      {Object.keys(cart).length !== 0 && (
        <div className="content-container total-price-container">
          <h2 className='section-title'>Total</h2>
          <div className='total-price-box'>
            <div className='total-price-usd'>${totalPriceUSD}</div>
            <div className='total-price-eth'>~ {totalPriceETH} ETH</div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
