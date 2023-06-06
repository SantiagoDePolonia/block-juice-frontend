
interface QuantityButton extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

function QuantityButton({children, ...restProps}: QuantityButton) {
  return (
    <button className="quantity-button" {...restProps}>
      {children}
    </button>
  )
}

export default QuantityButton;