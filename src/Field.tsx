import { useCallback, useState } from 'react'
import PrivateCard from './PrivateCard'
import PublicCard, { aspectRatio } from './PublicCard'

const widthCardCount = 10

type propsType = {
  zones: ZoneType[],
  isPlayer: boolean,
  moveCards: (targetZone: ZoneType) => void,
  selectedCards: CardType[],
  setSelectedCards: React.Dispatch<React.SetStateAction<CardType[]>>,
}

const Field = (props: propsType) => {
  const { zones, isPlayer, selectedCards, setSelectedCards, } = props

  const [isDeck, setIsDeck] = useState<boolean>(false)
  const [isGrave, setIsGrave] = useState<boolean>(false)

  const moveCards = useCallback((targetZoneName: string) => {
    const targetZone = zones.find((zone) => zone.name === targetZoneName)
    targetZone && props.moveCards(targetZone)
  }, [zones, props,])

  if (isGrave || isDeck) {
    const zoneName = isGrave ? '墓地' : isDeck ? '山札' : undefined

    return (
      <div className={isPlayer ? 'bg-blue-100' : 'bg-red-100'}>
        <div style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'left', alignItems: 'center', }}>
            <div style={{ width: `${100 / widthCardCount}%` }}>
              <div style={{ textAlign: 'center', }}>
                <button
                  style={{ width: '100%', aspectRatio: aspectRatio, }}
                  type='button'
                  onClick={() => {
                    setIsGrave(false)
                    setIsDeck(false)
                  }}
                  children={<> 閉じる </>}
                />
              </div>
            </div>
            {zones.find((zone) => zone.name === zoneName)?.cards.map((card) => {
              return (
                <div style={{ textAlign: 'center', width: `${100 / widthCardCount}%`, }} key={card.uuid}>
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
      </div>
    )
  }

  return (
    <div className={isPlayer ? 'bg-blue-100' : 'bg-red-100'}>
      <div style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'left', alignItems: 'center', }}>
          <div style={{ width: `${100 / widthCardCount}%` }}>
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
              <div style={{ textAlign: 'center', width: `${100 / widthCardCount}%`, }} key={card.uuid}>
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
          <div style={{ width: `${100 / widthCardCount}%` }}>
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
              <div style={{ textAlign: 'center', width: `${100 / widthCardCount}%`, }} key={card.uuid}>
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
          <div style={{ width: `${100 / widthCardCount}%` }}>
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
            if (isPlayer || card.isPublic)
              return (
                <div style={{ textAlign: 'center', width: `${100 / widthCardCount}%`, }} key={card.uuid}>
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
              <div className='bg-gray-200' style={{ textAlign: 'center', width: `${100 / widthCardCount}%`, }} key={card.uuid}>
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
          <div style={{ width: `${100 / widthCardCount}%` }}>
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
            if (card.isPublic)
              return (
                <div style={{ textAlign: 'center', width: `${100 / widthCardCount}%`, }} key={card.uuid}>
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
              <div className='bg-gray-200' style={{ textAlign: 'center', width: `${100 / widthCardCount}%`, }} key={card.uuid}>
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
          <div style={{ width: `${100 / widthCardCount}%` }}>
            <div style={{ textAlign: 'center', }}>
              <button
                style={{ width: '100%', aspectRatio: aspectRatio, }}
                type='button'
                onClick={() => {
                  if (selectedCards.length === 0)
                    setIsDeck(true)
                  else
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
          <div style={{ width: `${100 / widthCardCount}%` }}>
            <div style={{ textAlign: 'center', }}>
              <button
                style={{ width: '100%', aspectRatio: aspectRatio, }}
                type='button'
                onClick={() => {
                  if (selectedCards.length === 0)
                    setIsGrave(true)
                  else
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
          <div style={{ width: `${100 / widthCardCount}%` }}>
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
            if (card.isPublic)
              return (
                <div style={{ textAlign: 'center', width: `${100 / widthCardCount}%`, }} key={card.uuid}>
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
              <div className='bg-gray-200' style={{ justifySelf: 'left', textAlign: 'center', width: `${100 / widthCardCount}%`, }} key={card.uuid}>
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
          <div style={{ width: `${100 / widthCardCount}%` }}>
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
              <div style={{ textAlign: 'center', width: `${100 / widthCardCount}%`, rotate: '180deg', }} key={card.uuid}>
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
          <div style={{ width: `${100 / widthCardCount}%` }}>
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
            if (isPlayer || card.isPublic)
              return (
                <div style={{ textAlign: 'center', width: `${100 / widthCardCount}%`, }} key={card.uuid}>
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
              <div className='bg-gray-200' style={{ textAlign: 'center', width: `${100 / widthCardCount}%`, }} key={card.uuid}>
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
