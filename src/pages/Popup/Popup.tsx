import React from 'react'
import './Popup.css';
import styled from 'styled-components'

const Header = styled.div`
  display: flex;
  height: 30px;
  color: white;
  font-size: 16px;
  text-align: center;
  font-family: 'Press Start 2P';
  text-shadow: 3px 3px 0px #2038ec;
  margin: 4px;
  justify-content: center;
  align-items:center;
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
const Red = styled.text`
  color: red;
`

const Popup = () => {
  return (
    <div className="App">
      <Header>
        wi<Red>z</Red>ard <Red className='K'>k</Red>ingdom
      <img className="Logo" src='https://i.imgur.com/Y6TQvTC.png' width="25" height="25"></img>
      </Header>
      <ChatContainer>
          <ChatBox></ChatBox>
        <InputBox>
          <MsgInput></MsgInput>
          <SendButton>Send</SendButton>
        </InputBox>
      </ChatContainer>
      
      
    </div>
  );
};

export default Popup;
