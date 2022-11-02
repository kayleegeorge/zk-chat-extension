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

export default function Popup() {
  // might want to put this is in a mainpage function component
  // const { activate, deactivate, account, provider } = useWeb3Connect(SUPPORTED_CHAIN_ID);
    
  // set up waku instance
  const [waku, setWaku] = useState<WakuLight | undefined>(undefined);
  useEffect(() => {
    initWaku()
      .then(() => {
        setWaku(waku);
        console.log("Waku init done");
      })
      .catch((e) => console.log("Waku init failed ", e));
  }, []);

  // set up messaging
  const [message, setMessage] = useState('');

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
          <SendButton>Send</SendButton>
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
