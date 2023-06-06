import './EmptyCartContent.css'

function EmptyCartContent() {
  return (<div className='empty-cart-content'>
    <div className='grey-square'>
      <img src='/icons/empty-cart.png' alt='Empty Cart' />
    </div>
    <div className='empty-cart-text'>Here your order will be displayed</div>
  </div>);
}

export default EmptyCartContent;