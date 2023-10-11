import { Fragment, useEffect, useState } from 'react'

const Decks = () => {
  const [name, setName] = useState<string>('')
  const [deck, setDeck] = useState<{ image: string, count: number, }[]>([])
  const [images, setImages] = useState<string[] | null>(null)
  const [deckItems, setDeckItems] = useState<{ name: string, deck: { image: string, count: number }[], }[]>(() => {
    const key = 'deckItems'
    const string = window.localStorage.getItem(key)
    if (string) {
      try {
        return JSON.parse(string)
      }
      catch {
        window.localStorage.removeItem(key)
      }
    }
    return []
  })

  useEffect(() => {
    fetch('https://storage.googleapis.com/storage/v1/b/dm-file/o')
      .then((response) => {
        if (response.ok) return response.json()
        throw new Error(response.statusText)
      })
      .then((data: { items: { mediaLink: string, }[] }) => {
        setImages(data.items.map((item) => item.mediaLink))
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
      })
  }, [])

  if (images === null)
    return null

  return (
    <>
      {deckItems.length > 0 &&
        <>
          <h3> デッキ一覧 </h3>

          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '50%' }}>
                  デッキ名
                </th>
                <th style={{ width: '50%' }}>
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {deckItems.map((deckItem, index) => {
                return (
                  <tr key={index} style={{ textAlign: 'center' }}>
                    <td> {deckItem.name} </td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', }}>
                        <button
                          type='button'
                          style={{
                            width: '30%',
                            height: '2rem',
                            border: 'thin black solid',
                            borderRadius: '4px',
                          }}
                          onClick={() => {
                            setDeck(deckItem.deck)
                          }}
                          children={<> コピー </>}
                        />
                        <button
                          type='button'
                          style={{
                            width: '30%',
                            height: '2rem',
                            border: 'thin black solid',
                            borderRadius: '4px',
                          }}
                          onClick={() => {
                            if (window.confirm(`${deckItem.name}を削除しますか？`) === false)
                              return

                            setDeckItems((current) => {
                              const newDeckItems = current.filter((_, i) => i !== index)
                              window.localStorage.setItem('deckItems', JSON.stringify(newDeckItems))
                              return newDeckItems
                            })
                          }}
                          children={<> 削除 </>}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </>
      }

      <h3> デッキ画像 </h3>

      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', }}>
        <input
          type='text'
          style={{
            width: '70%',
            height: '2rem',
            border: 'thin black solid',
            borderRadius: '4px',
          }}
          value={name}
          onChange={(changeEvent) => {
            setName(changeEvent.target.value)
          }}
        />
        <button
          type='button'
          style={{
            width: '30%',
            height: '2rem',
            border: 'thin black solid',
            borderRadius: '4px',
          }}
          disabled={name === ''}
          onClick={() => {
            const key = 'deckItems'
            try {
              const stringDeckItems = window.localStorage.getItem(key)
              const deckItems = stringDeckItems ? JSON.parse(stringDeckItems) : []
              window.localStorage.setItem(key, JSON.stringify([...deckItems, { name: name, deck: deck }]))
              alert(`${name}を保存しました。`)
              setDeck([])
              setName('')
            }
            catch {
              window.localStorage.removeItem(key)
            }
          }}
          children={<> 保存 </>}
        />
      </div>

      <DeckList deck={deck} />

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center', }}>
        <div style={{ width: `${100 / 2}%`, padding: '0.25rem', }}>
          <button
            type='button'
            style={{
              width: '100%',
              height: '2rem',
              border: 'thin black solid',
              borderRadius: '4px',
            }}
            onClick={() => {
              if (window.confirm('本当にリセットしますか？'))
                setDeck([])
            }}
            children={<> リセット </>}
          />
        </div>
      </div>

      <h3> 利用可能カード一覧 </h3>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', }}>
        {images.sort((a, b) => a < b ? -1 : a > b ? 1 : 0).map((image) => {
          const deckCard = deck.find((item) => item.image === image)

          return (
            <div style={{ width: `${100 / 3}%`, }} key={image}>
              <div style={{ border: 'thin black solid', borderRadius: '4px', margin: '0.1rem', padding: '0.25rem', }}>
                <img
                  src={image}
                  alt={image}
                />

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center', }}>
                  <div style={{ width: `${100 / 2}%`, padding: '0.25rem', }}>
                    <button
                      type='button'
                      style={{
                        backgroundColor: deckCard ? deckCard.count === 0 ? 'lightblue' : undefined : 'lightblue',
                        width: '100%',
                        height: '2rem',
                        border: 'thin black solid',
                        borderRadius: '4px',
                      }}
                      onClick={() => {
                        setDeck((current) => current.filter((item) => item.image !== image))
                      }}
                      children={<> 0 </>}
                    />
                  </div>
                  <div style={{ width: `${100 / 2}%`, padding: '0.25rem', }}>
                    <button
                      type='button'
                      style={{
                        backgroundColor: deckCard && deckCard.count === 4 ? 'lightblue' : undefined,
                        width: '100%',
                        height: '2rem',
                        border: 'thin black solid',
                        borderRadius: '4px',
                      }}
                      onClick={() => {
                        setDeck((current) => {
                          const others = current.filter((card) => card.image !== image)
                          return [
                            ...others,
                            {
                              image: image,
                              count: 4,
                            },
                          ]
                        })
                      }}
                      children={<> 4 </>}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center', }}>
                  {Array(3).fill(true).map((_, index) => {
                    const count = index + 1

                    return (
                      <div style={{ width: `${100 / 3}%`, padding: '0.25rem', }} key={index}>
                        <button
                          type='button'
                          style={{
                            backgroundColor: deckCard && deckCard.count === count ? 'lightblue' : undefined,
                            width: '100%',
                            height: '2rem',
                            border: 'thin black solid',
                            borderRadius: '4px',
                          }}
                          onClick={() => {
                            setDeck((current) => {
                              const others = current.filter((card) => card.image !== image)
                              return [
                                ...others,
                                {
                                  image: image,
                                  count: count,
                                },
                              ]
                            })
                          }}
                          children={<> {count} </>}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Decks

const DeckList = (props: { deck: { image: string, count: number, }[] }) => {
  const { deck } = props

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'left', alignItems: 'center', }}>
      {deck.sort((a, b) => a.image < b.image ? -1 : a.image > b.image ? 1 : 0).sort((a, b) => a.count > b.count ? -1 : a.count < b.count ? 1 : 0).map((item) => {
        return (
          <Fragment key={item.image}>
            {Array(item.count).fill(true).map((_, index) => {
              return (
                <div style={{ width: `${100 / 8}%` }} key={index}>
                  <img
                    src={item.image}
                    alt={item.image}
                  />
                </div>
              )
            })}
          </Fragment>
        )
      })}
    </div>
  )
}
