"use client"

import { useReducer } from "react"
import { useAccount, useBlockNumber, useChainId, useContractEvent } from "wagmi"

import { WagmiMintExample } from "../../contracts/WagmiMintExample.sol"

export const WagmiEvents = () => {
  const chainId = useChainId()

  const { address } = useAccount()

  const { data: blockNumber } = useBlockNumber()

  const [events, concatEvents] = useReducer(
    (events: any[], newEvents: any[]) => [...events, ...newEvents],
    [] as any[]
  )

  /**
   * ABI of events can be found at events.Foo
   * - Don't call fn and it is an object without args
   * - Call fn with args and fromBlock etc. and it returns an object with args
   */
  const transferFromEvents = WagmiMintExample.events({ chainId }).Transfer({
    fromBlock: blockNumber && blockNumber - BigInt(1_000),
    args: {
      from: address,
    },
  })
  const transferToEvents = WagmiMintExample.events().Transfer({
    fromBlock: blockNumber && blockNumber - BigInt(1_000),
    args: {
      to: address,
    },
  })

  useContractEvent({
    ...transferFromEvents,
    listener: (event) => {
      concatEvents([event])
    },
  })
  useContractEvent({
    ...transferToEvents,
    listener: (event) => {
      concatEvents([event])
    },
  })

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column-reverse" }}>
        {events.map((event, i) => {
          return (
            <div key={i}>
              <div>Event {i}</div>
              <div>{JSON.stringify(event)}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
