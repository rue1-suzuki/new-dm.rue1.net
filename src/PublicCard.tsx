export const aspectRatio = '63/88'

const PublicCard = (props: { card: CardType, isSelected: boolean, setSelectedCards: () => void, }) => {
  const { card, isSelected, setSelectedCards, } = props

  return (
    <img
      onClick={setSelectedCards}
      style={{
        width: '100%',
        mixBlendMode: isSelected ? 'multiply' : undefined,
        backgroundColor: isSelected ? 'gray' : undefined,
        aspectRatio: aspectRatio,
        rotate: card.isTap ? '90deg' : undefined,
        objectFit: 'cover',
        objectPosition: 'top',
      }}
      alt={card.image}
      src={card.image}
    />
  )
}

export default PublicCard
