import {nanoid} from 'nanoid';
import type {NextPage} from 'next';
import Image from 'next/image';
import {useState} from 'react';
import styled from 'styled-components';
import aiIcon from '../assets/ai.svg';
import sendIcon from '../assets/send.svg';
import userIcon from '../assets/user.svg';

interface Message {
  id: string;
  author: 'user' | 'ai';
  text: string;
}

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message>({
    id: nanoid(),
    author: 'user',
    text: '',
  });
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async () => {
    const response = await fetch('/api/message', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({prompt: message.text + '\n'}),
    });

    const newMessage = {
      id: nanoid(),
      author: 'ai' as Message['author'],
      text: 'Something went wrong',
    };

    if (!response.ok) {
      setMessages(prev => [...prev, newMessage]);
    }

    const data = await response.json();

    setMessages(prev => [...prev, {id: '', author: 'ai', text: data.text}]);
    setLoading(false);
  };

  const handleChange = ({
    currentTarget: {value},
  }: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(prev => ({...prev, text: value}));
  };

  const handleSubmit = () => {
    if (!message.text) return;
    if (loading) return;

    setLoading(true);
    setMessages(prev => [...prev, message]);
    setMessage({id: nanoid(), author: 'user', text: ''});
    sendMessage();
  };

  const handleKeyDown = ({key}: React.KeyboardEvent<HTMLInputElement>) => {
    if (key !== 'Enter') return;
    handleSubmit();
  };

  return (
    <Page>
      <Chat>
        <Messages>
          {messages.map(message => (
            <Message
              key={message.id}
              bgColor={message.author === 'user' ? '#343541' : '#40414F'}
            >
              <MessageAvatar
                bgColor={message.author === 'user' ? '#5436DA' : '#10a37f'}
              >
                <Image
                  src={message.author === 'user' ? userIcon : aiIcon}
                  alt={"Avatar's image"}
                />
              </MessageAvatar>
              <MessageText>{message.text}</MessageText>
            </Message>
          ))}
        </Messages>
      </Chat>
      <ChatForm onSubmit={e => e.preventDefault()}>
        <ChatInput
          value={message.text}
          placeholder={'Ask Lever AI...'}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <ChatButton onClick={handleSubmit}>
          <Image src={sendIcon} alt={"Send button's image"} />
        </ChatButton>
      </ChatForm>
    </Page>
  );
};

const Page = styled.div`
  width: 100vw;
  height: 100vh;
  background: #343541;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const Chat = styled.div`
  width: 100%;
  padding-bottom: 20px;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  scroll-behavior: smooth;
`;
const Messages = styled.ul``;
const Message = styled.li<{bgColor: string}>`
  padding: 20px 10px;
  background: ${props => props.bgColor};
  display: flex;
`;
const MessageAvatar = styled.div<{bgColor: string}>`
  width: 36px;
  height: 36px;
  border-radius: 5px;
  background: ${props => props.bgColor};
  display: flex;
  justify-content: center;
  align-items: center;
`;
const MessageText = styled.div`
  flex: 1;
  color: #dcdcdc;
  margin-left: 20px;
  font-size: 18px;
  white-space: pre-wrap;
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
const ChatForm = styled.form`
  width: 100%;
  padding: 10px;
  background: #40414f;
  display: flex;
`;
const ChatInput = styled.input`
  width: 100%;
  padding: 10px;
  color: #fff;
  font-size: 18px;
  background: transparent;
  border-radius: 5px;
  border: none;
  outline: none;
`;
const ChatButton = styled.button`
  border: 0;
  background: transparent;
  outline: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

export default Home;
