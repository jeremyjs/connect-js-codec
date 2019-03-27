const test = require('ava')
const ProtoMessages = require('connect-protobuf-messages')
const EncodeDecode = require('connect-js-encode-decode')
const AdapterTLS = require('connect-js-adapter-tls')

const { Codec, codec: createCodec } = require('./index')

test.cb('encode and send heartbeat message then receive and decode response', t => {
  const protocol = new ProtoMessages([
    { file: 'CommonMessages.proto' },
    { file: 'OpenApiMessages.proto' },
  ])
  
  const adapter = new AdapterTLS({
    host: 'sandbox-tradeapi.spotware.com',
    port: 5035,
  })
  
  const encodeDecode = new EncodeDecode()
  
  const codec = new Codec(encodeDecode, protocol)
  
  protocol.load()
  protocol.build()
  
  const payloadType = protocol.getPayloadTypeByName('ProtoOAVersionReq')
  const payload = {}
  const clientMsgId = 'uuid'

  adapter.onOpen(function () {
    adapter.send(
      codec.encode(payloadType, payload, clientMsgId)
    )
  })
  
  adapter.onData(function (data) {
    codec.decode(data)
  })
  
  codec.subscribe(function (payloadType, response, id) {
    t.is(payloadType, 2105)
    t.is(response.version, '60')
    t.is(id, clientMsgId)
    t.end()
  })
  
  adapter.connect()
})

test.cb('w/ factory function, encode and send heartbeat message then receive and decode response', t => {
  const protocol = new ProtoMessages([
    { file: 'CommonMessages.proto' },
    { file: 'OpenApiMessages.proto' },
  ])
  
  const adapter = new AdapterTLS({
    host: 'sandbox-tradeapi.spotware.com',
    port: 5035,
  })
  
  const encodeDecode = new EncodeDecode()
  
  const codec = createCodec(encodeDecode, protocol)
  
  protocol.load()
  protocol.build()
  
  const payloadType = protocol.getPayloadTypeByName('ProtoOAVersionReq')
  const payload = {}
  const clientMsgId = 'uuid'

  adapter.onOpen(function () {
    adapter.send(
      codec.encode(payloadType, payload, clientMsgId)
    )
  })
  
  adapter.onData(function (data) {
    codec.decode(data)
  })
  
  codec.subscribe(function (payloadType, response, id) {
    t.is(payloadType, 2105)
    t.is(response.version, '60')
    t.is(id, clientMsgId)
    t.end()
  })
  
  adapter.connect()
})
