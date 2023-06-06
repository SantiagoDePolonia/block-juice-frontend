
interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({children, title}: SectionProps) {
  return (
    <div className="content-container">
      <h2 className='section-title'>{title}</h2>
      {children}
    </div>
  )
}

export default Section;