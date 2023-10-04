import { useCallback, useState } from 'react'

const aspectRatio = '1/1'

const Field = (props: { zones: ZoneType[], isPlayer: boolean, moveCards: (moveCards: CardType[], targetZone: ZoneType,) => void, }) => {
  const { zones, isPlayer, } = props

  const [selectedCards, setSelectedCards] = useState<CardType[]>([])

  const moveCards = useCallback((targetZoneName: string,) => {
    const targetZone = zones.find((zone) => zone.name === targetZoneName)
    targetZone && props.moveCards(selectedCards, targetZone)
    setSelectedCards([])
  }, [zones, selectedCards, props,])

  return (
    <div className={isPlayer ? 'bg-blue-100' : 'bg-red-100'}>
      <div style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'left', alignItems: 'center', }}>
          <div style={{ width: `${100 / 10}%` }}>
            <div style={{ textAlign: 'center', }}>
              <button
                style={{ width: '100%', aspectRatio: aspectRatio, }}
                type='button'
                onClick={() => {
                  moveCards('BZ')
                }}
                children={
                  <>
                    BZ<br />
                    ({zones.find((zone) => zone.name === 'BZ')?.cards.length})
                  </>
                }
              />
            </div>
          </div>
          {zones.find((zone) => zone.name === 'BZ')?.cards.map((card) => {
            return (
              <div style={{ textAlign: 'center', width: `${100 / 10}%`, }} key={card.uuid}>
                <PublicCard
                  card={card}
                  isSelected={selectedCards.includes(card)}
                  setSelectedCards={() => {
                    setSelectedCards((current) => {
                      if (current.includes(card))
                        return current.filter((c) => c !== card)
                      return [...current, card]
                    })
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'left', alignItems: 'center', }}>
          <div style={{ width: `${100 / 10}%` }}>
            <div style={{ textAlign: 'center', }}>
              <button
                style={{ width: '100%', aspectRatio: aspectRatio, }}
                type='button'
                onClick={() => {
                  moveCards('保留')
                }}
                children={
                  <>
                    保留<br />
                    ({zones.find((zone) => zone.name === '保留')?.cards.length})
                  </>
                }
              />
            </div>
          </div>
          {zones.find((zone) => zone.name === '保留')?.cards.map((card, index) => {
            return (
              <div style={{ textAlign: 'center', width: `${100 / 10}%`, }} key={card.uuid}>
                <PublicCard
                  card={card}
                  isSelected={selectedCards.includes(card)}
                  setSelectedCards={() => {
                    setSelectedCards((current) => {
                      if (current.includes(card))
                        return current.filter((c) => c !== card)
                      return [...current, card]
                    })
                  }}
                />
              </div>
            )
          })}
          <div style={{ width: `${100 / 10}%` }}>
            <div style={{ textAlign: 'center', }}>
              <button
                style={{ width: '100%', aspectRatio: aspectRatio, }}
                type='button'
                onClick={() => {
                  moveCards('オモテ')
                }}
                children={
                  <>
                    オモテ<br />
                    ({zones.find((zone) => zone.name === 'オモテ')?.cards.length})
                  </>
                }
              />
            </div>
          </div>
          {zones.find((zone) => zone.name === 'オモテ')?.cards.map((card, index) => {
            if (isPlayer)
              return (
                <div style={{ textAlign: 'center', width: `${100 / 10}%`, }} key={card.uuid}>
                  <PublicCard
                    card={card}
                    isSelected={selectedCards.includes(card)}
                    setSelectedCards={() => {
                      setSelectedCards((current) => {
                        if (current.includes(card))
                          return current.filter((c) => c !== card)
                        return [...current, card]
                      })
                    }}
                  />
                </div>
              )
            return (
              <div className='bg-gray-200' style={{ textAlign: 'center', width: `${100 / 10}%`, }} key={card.uuid}>
                <PrivateCard
                  children={`オモテ${index + 1}`}
                  isSelected={selectedCards.includes(card)}
                  setSelectedCards={() => {
                    setSelectedCards((current) => {
                      if (current.includes(card))
                        return current.filter((c) => c !== card)
                      return [...current, card]
                    })
                  }}
                />
              </div>
            )
          })}
          <div style={{ width: `${100 / 10}%` }}>
            <div style={{ textAlign: 'center', }}>
              <button
                style={{ width: '100%', aspectRatio: aspectRatio, }}
                type='button'
                onClick={() => {
                  moveCards('ウラ')
                }}
                children={
                  <>
                    ウラ<br />
                    ({zones.find((zone) => zone.name === 'ウラ')?.cards.length})
                  </>
                }
              />
            </div>
          </div>
          {zones.find((zone) => zone.name === 'ウラ')?.cards.map((card, index) => {
            return (
              <div className='bg-gray-200' style={{ textAlign: 'center', width: `${100 / 10}%`, }} key={card.uuid}>
                <PrivateCard
                  children={`ウラ${index + 1}`}
                  isSelected={selectedCards.includes(card)}
                  setSelectedCards={() => {
                    setSelectedCards((current) => {
                      if (current.includes(card))
                        return current.filter((c) => c !== card)
                      return [...current, card]
                    })
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', }}>
          <div style={{ width: `${100 / 10}%` }}>
            <div style={{ textAlign: 'center', }}>
              <button
                style={{ width: '100%', aspectRatio: aspectRatio, }}
                type='button'
                onClick={() => {
                  moveCards('山札')
                }}
                children={
                  <>
                    山札<br />
                    ({zones.find((zone) => zone.name === '山札')?.cards.length})
                  </>
                }
              />
            </div>
          </div>
          <div style={{ width: `${100 / 10}%` }}>
            <div style={{ textAlign: 'center', }}>
              <button
                style={{ width: '100%', aspectRatio: aspectRatio, }}
                type='button'
                onClick={() => {
                  moveCards('墓地')
                }}
                children={
                  <>
                    墓地<br />
                    ({zones.find((zone) => zone.name === '墓地')?.cards.length})
                  </>
                }
              />
            </div>
          </div>
          <div style={{ width: `${100 / 10}%` }}>
            <div style={{ textAlign: 'center', }}>
              <button
                style={{ width: '100%', aspectRatio: aspectRatio, }}
                type='button'
                onClick={() => {
                  moveCards('盾')
                }}
                children={
                  <>
                    盾<br />
                    ({zones.find((zone) => zone.name === '盾')?.cards.length})
                  </>
                }
              />
            </div>
          </div>
          {zones.find((zone) => zone.name === '盾')?.cards.map((card, index) => {
            return (
              <div className='bg-gray-200' style={{ justifySelf: 'left', textAlign: 'center', width: `${100 / 10}%`, }} key={card.uuid}>
                <PrivateCard
                  children={`盾${index + 1}`}
                  isSelected={selectedCards.includes(card)}
                  setSelectedCards={() => {
                    setSelectedCards((current) => {
                      if (current.includes(card))
                        return current.filter((c) => c !== card)
                      return [...current, card]
                    })
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'left', alignItems: 'center', }}>
          <div style={{ width: `${100 / 10}%` }}>
            <div style={{ textAlign: 'center', }}>
              <button
                style={{ width: '100%', aspectRatio: aspectRatio, }}
                type='button'
                onClick={() => {
                  moveCards('マナ')
                }}
                children={
                  <>
                    マナ<br />
                    ({zones.find((zone) => zone.name === 'マナ')?.cards.length})
                  </>
                }
              />
            </div>
          </div>
          {zones.find((zone) => zone.name === 'マナ')?.cards.map((card) => {
            return (
              <div style={{ textAlign: 'center', width: `${100 / 10}%`, rotate: '180deg', }} key={card.uuid}>
                <PublicCard
                  card={card}
                  isSelected={selectedCards.includes(card)}
                  setSelectedCards={() => {
                    setSelectedCards((current) => {
                      if (current.includes(card))
                        return current.filter((c) => c !== card)
                      return [...current, card]
                    })
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'left', alignItems: 'center', }}>
          <div style={{ width: `${100 / 10}%` }}>
            <div style={{ textAlign: 'center', }}>
              <button
                style={{ width: '100%', aspectRatio: aspectRatio, }}
                type='button'
                onClick={() => {
                  moveCards('手札')
                }}
                children={
                  <>
                    手札<br />
                    ({zones.find((zone) => zone.name === '手札')?.cards.length})
                  </>
                }
              />
            </div>
          </div>
          {zones.find((zone) => zone.name === '手札')?.cards.map((card, index) => {
            if (isPlayer)
              return (
                <div style={{ textAlign: 'center', width: `${100 / 10}%`, }} key={card.uuid}>
                  <PublicCard
                    card={card}
                    isSelected={selectedCards.includes(card)}
                    setSelectedCards={() => {
                      setSelectedCards((current) => {
                        if (current.includes(card))
                          return current.filter((c) => c !== card)
                        return [...current, card]
                      })
                    }}
                  />
                </div>
              )
            return (
              <div className='bg-gray-200' style={{ textAlign: 'center', width: `${100 / 10}%`, }} key={card.uuid}>
                <PrivateCard
                  children={`手札${index + 1}`}
                  isSelected={selectedCards.includes(card)}
                  setSelectedCards={() => {
                    setSelectedCards((current) => {
                      if (current.includes(card))
                        return current.filter((c) => c !== card)
                      return [...current, card]
                    })
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Field

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
        objectFit: 'cover',
        objectPosition: 'top',
      }}
      alt={card.image}
      src={card.image}
    />
  )
}

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
