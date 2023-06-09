import banner from '/banner.png'
import './App.css'
import { useEffect, useState } from 'react';
import ItemCard from './ItemCard';
import Section from './Section';
import EmptyCartContent from './EmptyCartContent';
import { useAccount, useConnect, usePrepareContractWrite } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { useContractWrite } from 'wagmi'
import { BLOCK_JUICE_ABI } from '../constants';

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
    id: "0", name: "Apple", priceETH: "0.0001", priceUSD: "1.23", size: "500 ml", imageURL: '/items/apple.png'
  },
  {
    id: "1", name: "Cherry", priceETH: "0.0002", priceUSD: "2.23", size: "500 ml", imageURL: '/items/cherry.png',
  },
  {
    id: "2", name: "Kiwi + Mint", priceETH: "0.0012", priceUSD: "3.23", size: "500 ml", imageURL: '/items/kiwi_mint.png',
  },
  {
    id: "3", name: "Orange", priceETH: "0.0012", priceUSD: "3.00", size: "500 ml", imageURL: '/items/orange.png',
  }
];

function App() {
  const [items,]= useState(DEMO_ITEMS);
  const [cart, setCart]= useState<CartType>({});

  const [totalPriceUSD, setTotalPriceUSD] = useState<string>("");
  const [totalPriceETH, setTotalPriceETH] = useState<string>("");
  const [tip, setTip] = useState(0);

  // This status is used for buing flow
  const [buyingStatus, setBuyingStatus] = useState("preparing");

  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { isConnected } = useAccount()
  // Note: The following useEffect hook should run only once at prod.
  // It might runs multiple times at dev.
  // useEffect(() => {
    // TODO: fetch items from server

    // setItems() ...
  // }, []);
  const { config } = usePrepareContractWrite({
    address: BLOCK_JUICE_ABI.address,
    abi: BLOCK_JUICE_ABI.abi,
    functionName: 'buyProduct',
    args: [String(0),String(1),String(3)]
  })
  const { write } = useContractWrite(config);
  useEffect(() => {
    if(buyingStatus === 'connect_wallet') {
      connect()
    } else if(buyingStatus === 'interact_with_smart_contract') {
      if(write) {
        write();
      }
      // Make transaction based on state
    }
  },[buyingStatus])

  useEffect(() => {
    if(isConnected && buyingStatus !=='preparing') {
      setBuyingStatus('interact_with_smart_contract')
    }
  }, [isConnected])
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

  const cartRows = Object.keys(cart).filter(itemId => cart[itemId].quantity).map((itemId) => {
    const item = items.find((item) => item.id === itemId) as StoreItem;
    return {...item, quantity: cart[itemId].quantity}
  });
  
  const isBuyButtonDisabled = cartRows.length === 0 || buyingStatus !== 'preparing';
  const handleByButtonClick = () => {
    setBuyingStatus('connect_wallet')
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

      <Section
        title={'My Order'}
        titleRightContent={Object.keys(cart).length !== 0 ?
          <div className='clear-all-button' onClick={()=> {setCart({})}}>
            Clear All <img src='/icons/x.png' alt='Clear All' />
          </div> : null
        }>

        <div className='cart-box'>
          {Object.keys(cart).length === 0 ? 
            <EmptyCartContent /> :
            <div className='cart-content'>
              <table className='table'>
                <tr className='cart-row-header row'>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th className='cart-product-price'>Price</th>
                  <th className='cart-table-actions-column'>
                    {/* Actions */}
                  </th>
                </tr>
                {cartRows.map((cartRow) => (
                  <tr className='cart-row row' key={cartRow.id}>
                    <td>
                      <div className='cart-product-cell'>
                        <div className='cart-product-image'>
                          <img src={cartRow.imageURL} alt={cartRow.name} width="62" />
                        </div>
                        <div className='cart-product-details-box'>
                          <div className='cart-product-name'>
                            {cartRow.name}
                          </div>
                          <div className='cart-product-size'>
                            {cartRow.size}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{cartRow?.quantity}x</td>
                    <td>
                      <div className='cart-product-price'>
                        <div className='cart-product-price-usd'>${cartRow.priceUSD}</div>
                        <div className='cart-product-price-eth'>~ {cartRow.priceETH} ETH</div>
                      </div>
                    </td>
                    <td onClick={() => removeItem(cartRow.id)}>
                      <img src='/icons/trash.png' alt='Delete icon' />
                    </td>
                  </tr>
                ))}
                <tr className='cart-row row'>
                  <td colSpan={2}>
                    <p>Tip us with 3% of the bill and win a prize!</p>
                    <p className='sub-text'>Prizes are extra drink, merchs from sponsors or even a cool NFT</p>
                  </td>
                  {tip === 0 ?
                    <td colSpan={2} className='cell-to-right'>
                      <button onClick={() => setTip(3)} className='try-your-luck-button'>
                        Try your luck!
                      </button>
                    </td>
                  :
                    <td onClick={() => setTip(0)} className='cell-to-right' colSpan={2}>
                      <img src='/icons/trash.png' alt='Delete icon' />
                    </td>
                  }
                </tr>
              </table>
              {/* <div className='break-line' /> */}
            </div>
          }
        </div>
      </Section>

      {Object.keys(cart).length !== 0 && (
        <Section title={'Total'} titleRightContent={
          <>
            <div className='total-price-usd'>${totalPriceUSD}</div>
            <div className='total-price-eth'>~ {totalPriceETH} ETH</div>
          </>
        } />
      )}
      <div className='content-container buy-buttons'>
        <button className='buy-metamask' disabled={isBuyButtonDisabled} onClick={handleByButtonClick}>
          Pay by Metamask <img src='/icons/metamask.png' alt='Metamask icon' width="68" />
        </button>
        <button className='buy-other' disabled={isBuyButtonDisabled} onClick={handleByButtonClick}>
          Pay by Other Wallet
        </button>
      </div>
    </>
  )
}

export default App
