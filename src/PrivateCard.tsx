const aspectRatio = '1/1'

const PrivateCard = (props: { children: string, isSelected: boolean, setSelectedCards: () => void, }) => {
  const { children, isSelected, setSelectedCards, } = props

  return (
    <div
      onClick={setSelectedCards}
      style={{
        width: '100%',
        mixBlendMode: isSelected ? 'multiply' : undefined,
        backgroundColor: isSelected ? 'gray' : undefined,
        aspectRatio: aspectRatio,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      children={children} />
  )
}

export default PrivateCard
