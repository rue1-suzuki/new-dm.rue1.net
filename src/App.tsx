import { useCallback, useEffect, useState } from 'react'
import Field from './Field'
import deck from './decks'
import shuffleArray from './shuffle'

const zoneNames = [
  '山札',
  '手札',
  'BZ',
  '墓地',
  'マナ',
  '盾',
  '保留',
  'オモテ',
  'ウラ',
]

const App = () => {
  const [websocket, setWebsocket] = useState<WebSocket | null>(null)

  const [rooms, setRooms] = useState<string[] | null>(null)
  const [roomId, setRoomId] = useState<string | null>(null)
  const [player, setPlayer] = useState<string | null>(null)
  const [zones, setZones] = useState<ZoneType[]>(() => {
    const stringZones = window.localStorage.getItem('zones')
    if (stringZones && window.confirm('前回の盤面を復元しますか？'))
      try {
        return JSON.parse(stringZones)
      }
      catch (error) {
        console.error(error)
      }

    window.localStorage.removeItem('zones')
    return ['プレイヤー1', 'プレイヤー2',].map((playerName) => {
      return zoneNames.map((zoneName) => {
        return {
          player: playerName,
          name: zoneName,
          cards: [],
        }
      })
    }).flat()

  })
  const [selectedCards, setSelectedCards] = useState<CardType[]>([])

  useEffect(() => {
    window.localStorage.setItem('zones', JSON.stringify(zones))
  }, [zones])

  useEffect(() => {
    const url = 'https://uvicorn-ei5avx3iya-an.a.run.app/rooms/'
    fetch(url)
      .then((response) => {
        if (response.ok) return response.json()
        throw new Error(response.statusText)
      })
      .then((data) => {
        setRooms(data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  const syncData = useCallback((syncedZones: ZoneType[]) => {
    if (websocket && websocket.readyState === WebSocket.OPEN)
      websocket.send(JSON.stringify(syncedZones))
  }, [websocket])

  const init = useCallback(() => {
    if (window.confirm('初期化しますか？') === false)
      return

    setZones((current) => {
      current.filter((zone) => zone.player === player).forEach((zone) => zone.cards = [])
      const deckZone = current.find((zone) => zone.player === player && zone.name === '山札')
      if (deckZone) {
        deckZone.cards = shuffleArray(deck)

        const handZone = current.find((zone) => zone.player === player && zone.name === '手札')
        handZone && Array(5).fill(true).forEach(() => {
          const card = deckZone.cards.shift()
          card && handZone.cards.push(card)
        })

        const sheildZone = current.find((zone) => zone.player === player && zone.name === '盾')
        sheildZone && Array(5).fill(true).forEach(() => {
          const card = deckZone.cards.shift()
          card && sheildZone.cards.push(card)
        })
      }
      syncData(current)
      return [...current]
    })
  }, [player, syncData,])

  const moveCards = useCallback((targetZone: ZoneType, isTop?: boolean) => {
    setZones((current) => {
      selectedCards.forEach((selectedCard) => {
        const sourceZone = current.find((zone) => zone.player === targetZone.player && zone.cards.includes(selectedCard))
        if (sourceZone) {
          sourceZone.cards = sourceZone.cards.filter((card) => card.uuid !== selectedCard.uuid)
          if (isTop)
            targetZone.cards = [...selectedCards, ...targetZone.cards]
          else
            targetZone.cards.push(selectedCard)
        }
      })
      syncData(current)
      return [...current]
    })
    setSelectedCards([])
  }, [selectedCards, syncData])

  const tapCards = useCallback(() => {
    setZones((current) => {
      current.forEach((zone) => {
        zone.cards.forEach((card) => {
          if (selectedCards.find((selectedCards) => selectedCards.uuid === card.uuid))
            card.isTap = !card.isTap
        })
      })
      syncData(current)
      return [...current]
    })
    setSelectedCards([])
  }, [selectedCards, syncData])

  const connectWebSocket = useCallback((room_id: string) => {
    const url = `wss://uvicorn-ei5avx3iya-an.a.run.app/ws/${room_id}/`
    const ws = new WebSocket(url)

    ws.onopen = () => {
      console.log('WebSocket connected')
      setRoomId(room_id)
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
      setWebsocket(null)
    }

    ws.onmessage = (event) => {
      if (event.data === '0')
        setTimeout(() => {
          syncData(zones)
        }, 1000)
      else
        setZones(JSON.parse(event.data))
    }

    setWebsocket(ws)

    return () => {
      ws.close()
    }
  }, [zones, syncData,])

  if (rooms === null)
    return (
      <div style={{ textAlign: 'center' }}>
        ルーム一覧取得中
      </div>
    )

  if (websocket === null)
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
          <button
            className='border border-blue-500 rounded m-1 p-1'
            type='button'
            onClick={() => {
              const min = 1000
              const max = 9999
              const random = Math.floor(Math.random() * (max - min + 1)) + min
              connectWebSocket(random.toString())
            }}
            children={<> 新規ルーム作成 </>}
          />
          {rooms.map((room) => {
            const onClick = () => {
              connectWebSocket(room)
            }
            return (
              <button
                className='border border-blue-500 rounded m-1 p-1'
                type='button'
                key={room}
                onClick={onClick}
                children={<> {room}に接続 </>}
              />
            )
          })}
        </div>
      </>
    )

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
        <h1> ルームID: {roomId} </h1>
        <div style={{ textAlign: 'center' }}>
          <select
            value={player ? player : ''}
            onChange={((event) => {
              setPlayer(event.target.value ? event.target.value : null)
            })}
            children={
              <>
                <option
                  value=''
                  children={<> プレイヤーを選択 </>}
                />
                {Array.from(new Set(zones.map((zone) => zone.player))).map((zonePlayer) => {
                  return (
                    <option
                      key={zonePlayer}
                      value={zonePlayer}
                      children={zonePlayer}
                    />
                  )
                })}
              </>
            }
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', }}>
          <button
            className='border border-blue-500 rounded m-1 p-1'
            onClick={() => {
              syncData(zones)
            }}
            children={<> 同期 </>}
          />
          <button
            className='border border-blue-500 rounded m-1 p-1'
            onClick={init}
            children={<> 最初から </>}
          />
        </div>
      </div>

      {player &&
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', }} >
            {Array.from(new Set(zones.map((zone) => zone.player))).filter((zonePlayer) => zonePlayer !== player).map((zonePlayer, _, zonePlayers) => {
              return (
                <div style={{ width: `${100 / zonePlayers.length}%`, border: 'thin solid black', borderRadius: '4px', }} key={zonePlayer}>
                  <div style={{ rotate: '180deg' }}>
                    <Field
                      zones={zones.filter((zone) => zone.player === zonePlayer)}
                      moveCards={moveCards}
                      isPlayer={false}
                      selectedCards={selectedCards}
                      setSelectedCards={setSelectedCards}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ border: 'thin solid black', borderRadius: '4px', }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center', }}>
              {['手札', 'マナ', 'オモテ',].filter((name) => name !== '山札').map((name) => {
                const onClick = () => {
                  const deckZone = zones.find((zone) => zone.player === player && zone.name === '山札')
                  const targetZone = zones.find((zone) => zone.player === player && zone.name === name)
                  if (deckZone && targetZone) {
                    setZones((current) => {
                      const card = deckZone.cards.shift()
                      card && targetZone.cards.push(card)
                      syncData(zones)
                      return [...current]
                    })
                  }
                }

                return (
                  <button
                    className='border border-blue-500 rounded m-1 p-1'
                    type='button'
                    key={name}
                    onClick={onClick}
                    children={<> 1{name} </>}
                  />
                )
              })}
              <button
                className='border border-blue-500 rounded m-1 p-1'
                onClick={() => {
                  setZones((current) => {
                    const targetZone = zones.find((zone) => zone.player === player && zone.name === '山札')
                    if (targetZone)
                      targetZone.cards = shuffleArray([...targetZone.cards])
                    return [...current]
                  })
                  alert('シャッフルしました。')
                }}
                children={<> シャッフル </>}
              />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center', }}>
              <button
                className='border border-blue-500 rounded m-1 p-1'
                type='button'
                onClick={() => {
                  setZones((current) => {
                    current.filter((zone) => zone.player === player).forEach((zone) => {
                      zone.cards.forEach((card) => {
                        card.isTap = false
                      })
                    })
                    const deckZone = current.find((zone) => zone.player === player && zone.name === '山札')
                    const targetZone = current.find((zone) => zone.player === player && zone.name === '手札')
                    if (deckZone && targetZone) {
                      const card = deckZone.cards.shift()
                      card && targetZone.cards.push(card)
                    }
                    syncData(current)
                    return [...current]
                  })
                }}
                children={<> ターン開始 </>}
              />
              <button
                className='border border-blue-500 rounded m-1 p-1'
                type='button'
                onClick={tapCards}
                children={<> タップ/アンタップ </>}
              />
              <button
                className='border border-blue-500 rounded m-1 p-1'
                type='button'
                onClick={() => {
                  const zone = zones.find((zone) => zone.player === player && zone.name === '山札')
                  zone && moveCards(zone)
                }}
                children={<> 山札下へ </>}
              />
              <button
                className='border border-blue-500 rounded m-1 p-1'
                type='button'
                onClick={() => {
                  const zone = zones.find((zone) => zone.player === player && zone.name === '山札')
                  zone && moveCards(zone, true)
                }}
                children={<> 山札上へ </>}
              />
            </div>
          </div>

          <div style={{ border: 'thin solid black', borderRadius: '4px', }}>
            <div style={{ rotate: '0deg' }}>
              <Field
                zones={zones.filter((zone) => zone.player === player)}
                moveCards={moveCards}
                isPlayer={true}
                selectedCards={selectedCards}
                setSelectedCards={setSelectedCards}
              />
            </div>
          </div>
        </>
      }
    </>
  )
}

export default App
