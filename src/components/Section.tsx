
interface SectionProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
  titleRightContent?: React.ReactNode;
}

function Section({children = null, title, className, titleRightContent}: SectionProps) {
  return (
    <div className={"content-container "+className}>
      <div className='section-title-box'>
        <h2 className='section-title'>{title}</h2>
        {titleRightContent && (
          <div className='section-title-right'>
            {titleRightContent}
          </div>
        )}
      </div>
      {children}
    </div>
  )
}

export default Section;