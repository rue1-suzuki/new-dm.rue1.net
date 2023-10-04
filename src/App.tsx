import { useCallback, useState } from 'react'
import Field from './Field'
import { deck } from './decks'
import shuffleArray from './shuffle'

const names = [
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

  const [player, setPlayer] = useState<string | null>(null)

  const [zones, setZones] = useState<ZoneType[]>(() => {
    return Array(2).fill(true).map((_, index) => {
      const player = `player${index + 1}`
      return names.map((name) => {
        return {
          player: player,
          name: name,
          cards: [],
        }
      })
    }).flat()
  })

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
          const card = deckZone.cards.pop()
          card && handZone.cards.push(card)
        })

        const sheildZone = current.find((zone) => zone.player === player && zone.name === '盾')
        sheildZone && Array(5).fill(true).forEach(() => {
          const card = deckZone.cards.pop()
          card && sheildZone.cards.push(card)
        })
      }
      syncData(current)
      return [...current]
    })
  }, [player, syncData,])

  const moveCards = useCallback((movedCards: CardType[], targetZone: ZoneType,) => {
    setZones((current) => {
      movedCards.forEach((movedCard) => {
        const sourceZone = current.find((zone) => zone.cards.includes(movedCard))
        if (sourceZone) {
          sourceZone.cards = sourceZone.cards.filter((card) => card.uuid !== movedCard.uuid)
          targetZone.cards.push(movedCard)
        }
      })
      syncData(current)
      return [...current]
    })
  }, [syncData])

  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket('wss://uvicorn-ei5avx3iya-an.a.run.app/ws/')

    ws.onopen = () => {
      console.log('WebSocket connected')
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
      setWebsocket(null)
    }

    ws.onmessage = (event) => {
      setZones(JSON.parse(event.data))
    }

    setWebsocket(ws)

    return () => {
      ws.close()
    }
  }, [])

  if (websocket === null)
    return (
      <>
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

        <div style={{ textAlign: 'center' }}>
          <button className='border border-blue-500 rounded m-1 p-1' disabled={player === null} onClick={connectWebSocket}>
            接続
          </button>
        </div>
      </>
    )

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', }}>
        <h1> あなた: {player} </h1>
        <button
          className='border border-blue-500 rounded m-1 p-1'
          onClick={init}
          children={<> 最初から </>}
        />
      </div>

      <div style={{ border: 'thin solid black', borderRadius: '4px', }}>
        <div style={{ rotate: '180deg' }}>
          <Field
            zones={zones.filter((zone) => zone.player !== player)}
            moveCards={moveCards}
            isPlayer={false}
          />
        </div>
      </div>

      <div style={{ border: 'thin solid black', borderRadius: '4px', }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', }}>
          {names.filter((name) => name !== '山札').map((name) => {
            const onClick = () => {
              const deckZone = zones.find((zone) => zone.player === player && zone.name === '山札')
              const targetZone = zones.find((zone) => zone.player === player && zone.name === name)
              if (deckZone && targetZone) {
                setZones((current) => {
                  const card = deckZone.cards.pop()
                  card && targetZone.cards.push(card)
                  syncData(zones)
                  return [...current]
                })
              }
            }

            return (
              <button
                className='border border-blue-500 rounded m-1 p-1'
                key={name}
                onClick={onClick}
                children={<> 1{name} </>}
              />
            )
          })}
        </div>
      </div>

      <div style={{ border: 'thin solid black', borderRadius: '4px', }}>
        <div style={{ rotate: '0deg' }}>
          <Field
            zones={zones.filter((zone) => zone.player === player)}
            moveCards={moveCards}
            isPlayer={true}
          />
        </div>
      </div>

      <div style={{ border: 'thin solid black', borderRadius: '4px', }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', }}>
          {zones.map((zone) => {

            const onClick = () => {
            }

            return (
              <button
                className='border border-blue-500 rounded m-1 p-1'
                key={zone.player + zone.name}
                onClick={onClick}
                children={<> シャッフル: {zone.player}の{zone.name} </>}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}

export default App
