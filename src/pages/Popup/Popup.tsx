import React, { useEffect, useState } from 'react'
import './Popup.css';
import styled from 'styled-components'
import type { WakuLight } from "js-waku/lib/interfaces";
import {
  Fleet,
  getPredefinedBootstrapNodes,
} from "js-waku/lib/predefined_bootstrap_nodes";
import { createLightNode } from "js-waku/lib/create_waku";
import { PeerDiscoveryStaticPeers } from "js-waku/lib/peer_discovery_static_list";
import protobuf from "protobufjs";
import { DecoderV0, EncoderV0 } from "js-waku/lib/waku_message/version_0";
import { Waku } from 'js-waku/lib/interfaces';
import { SendResult } from 'js-waku/lib/interfaces';

const Header = styled.div`
  display: flex;
  height: 30px;
  color: white;
  font-size: 13px;
  text-align: center;
  font-family: 'Press Start 2P';
  text-shadow: 3px 3px 0px #2038ec;
  margin: 4px;
  justify-content: center;
  align-items:center;
  padding-left: 4px;
`
const ChatContainer = styled.div` 
  margin: auto;
  width: 90%;
  height: 95%;
`
const ChatBox = styled.div`
  color: white;
  height: 80%;
  border: 1.5px solid white;
  margin: auto;
`
const InputBox = styled.div`
  display: flex;
  margin-left: 0px;
  height: 25px;
  margin-top: 8px;
  gap: 8px;
`
const MsgInput = styled.input`
  border: 1.5px solid white;
  color: white;
  background: none;
  font-size: 10px;
  width: 80%;
  font-family: Consolas,monaco,monospace;
  padding-left: 8px;
  :focus {
    outline:none!important;
  }
`

const SendButton = styled.button`
  border: 1.5px solid white;
  color: white;
  text-shadow: 1.1px 1.1px 0px darkgray;
  background-color: #2038ec;
  font-size: 10px;
  font-family: 'Press Start 2P';
  cursor: pointer;
  :hover {
    background-color: #1b31d1;
  }
`
const Red = styled.p`
  color: red;
`

/* set up messaging types */
// use different content names (e.g. 'private message') for diff topics
const ContentTopic = '/zk-chat/1/chat/proto';
const Encoder = new EncoderV0(ContentTopic);
const Decoder = new DecoderV0(ContentTopic);

const SimpleChatMessage = new protobuf.Type("SimpleChatMessage")
.add(new protobuf.Field("timestamp", 1, "uint64"))
.add(new protobuf.Field("text", 2, "string"));

export default function Popup() {
  // might want to put this is in a mainpage function component
  // const { activate, deactivate, account, provider } = useWeb3Connect(SUPPORTED_CHAIN_ID);
    
  // set up waku instance
  const [waku, setWaku] = useState<Waku | undefined>(undefined);
  const [wakuStatus, setWakuStatus] = useState<string>('None');

  useEffect(() => {
    initWaku()
      .then(() => {
        setWaku(waku);
        setWakuStatus('Ready')
        console.log("Waku init done");
      })
      .catch((e) => console.log("Waku init failed ", e));
  }, []);

  // set up messaging
  const [message, setMessage] = useState('');
  const sendMessageOnClick = () => {
    // check waku started/connected
    if (wakuStatus !== 'Ready' || !waku) return;

    const messageSent = sendMessage(message, waku, new Date())
    if (messageSent) messageSent.then(() => console.log('Message sent'));
  }

  return (
    <div className="App">
      <Header>
        wi<Red>Z</Red>ard <Red>K</Red>ingdom chat
      <img className="Logo" src='https://i.imgur.com/Y6TQvTC.png' width="25" height="25"></img>
      </Header>
      <ChatContainer>
          <ChatBox></ChatBox>
        <InputBox>
          <MsgInput
            name="message"
            type="text"
            value={message}
            onChange={() => setMessage(message)} 
          />
          <SendButton
            onClick={sendMessageOnClick}
            disabled={wakuStatus !== "Ready"}
          >Send</SendButton>
        </InputBox>
      </ChatContainer>

    </div>
  );
};


/* TODO: Move Waku helper functions */
// initializes waku instance
async function initWaku() {
  try {
    const waku = await createLightNode({
      libp2p: {
        // TODO: spawn Waku node when you connect to the site (websockets?)
        peerDiscovery: [
          new PeerDiscoveryStaticPeers(
            getPredefinedBootstrapNodes(selectFleetEnv())
          ),
        ],
      },
    });
    await waku.start();
    await waitForRemotePeer(waku, ["relay"]);
  } catch (e) {
    console.log("Issue starting waku ", e);
  }
}

function selectFleetEnv() {
  // Works with react-scripts
  if (process?.env?.NODE_ENV === "development") {
    return Fleet.Test;
  } else {
    return Fleet.Prod;
  }
}
//message: string, waku: WakuLight, timestamp: Date
function sendMessage(message: string, waku: Waku, timestamp: Date):Promise<SendResult> | undefined {
  const time = timestamp.getTime();

  // Encode to protobuf
  const protoMsg = SimpleChatMessage.create({
    timestamp: time,
    text: message,
  });
  const payload = SimpleChatMessage.encode(protoMsg).finish();
  if (!waku.relay) {
    console.log('error');
    return;
  }

  // Send over Waku Relay
  return waku.relay.send(Encoder, { payload });
}
function waitForRemotePeer(waku: WakuLight, arg1: string[]) {
  throw new Error('Function not implemented.');
}

