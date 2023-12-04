
// import React from 'react';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <h2 className="App-header">Embedded chatbot</h2>
//       <button onClick={() => console.log('button clicked')}>Button</button>
//     </div>
//   );
// }

// export default App;


import React, {useState, useEffect} from "react";
import { v4 as uuidv4 } from 'uuid';
import { Message } from "./models/common";
import Chat from "./Chat";

const App = () => {
	const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([{
		sender_name: 'AI',
		message_text: 'Hello! How can I help you?',
		message_id: '0'
	}]);
  const [isAnswerLoading, setIsAnswerLoading] = useState(false);
  const [error, setError] = useState("");
	const [isChatOpen, setIsChatOpen]= useState(false)

  	const onSentQuestion = async () => {
		setIsAnswerLoading(true)
		const tempQuestion:any = message;
		
		const tempMessages = [...messages, {message_text: message, sender_name: "User", message_id: uuidv4()}];
		setMessages(tempMessages);
		setMessage('')
		
		let isSelected = false;
		const org_tokens_str = localStorage.getItem('org_tokens');
		if(org_tokens_str){
			isSelected = JSON.parse(org_tokens_str).isSelected;
		};
		const response = await fetch(`${process.env.URL_SSL || 'https://await-uat.pretest.ai'}/embedded_chatbot_question`, {
			method: "POST",
			headers: {
				Accept: 'text/event-stream,application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				"question": tempQuestion,
				messages,
        is_org: false,
			})
		});

		if(!response.ok){
			const errorData = await response.json();
			setError(errorData['error']);
			return;
		}
		// This data is a ReadableStream
		const data = response.body;
		if (!data) {
			return;
		}

		let result = ""
		const reader = data.getReader();
		const decoder = new TextDecoder();
		let done = false;
		let key: any;
		while (!done) {
			const { value, done: doneReading } = await reader.read();
			let formattedChunk;
			done = doneReading;
			if (done) break;
			let chunk = decoder.decode(value);

			console.log('chun ', chunk.trim().split('data: ').filter((ele) => ele !== '' && !ele.includes('[DONE]')).map((ele: any) => {
				ele = ele.trim();
				if (ele.charAt(ele.length - 1) === '}') {
					try {
						return JSON.parse(ele).choices[0].delta.content;
					} catch (error) {
						console.error('JSON Parsing Error:', error);
					}
				}
				return '';
			}).join(''));
			if (chunk) {
				if (!chunk.startsWith('[sources]')) {
					if (!chunk.startsWith('data:')) chunk = `{data: {"id":"${chunk}`;
					formattedChunk = chunk.trim().split('data: ').filter((ele) => ele !== '' && !ele.includes('[DONE]')).map((ele: any) => {
						ele = ele.trim();
						if (ele.charAt(ele.length - 1) === '}') {
							try {
								return JSON.parse(ele).choices[0].delta.content;
							} catch (error) {
								console.error('JSON Parsing Error:', error);
							}
						}
						return '';
					}).join('');
				} else {
					formattedChunk = chunk;
				}
				console.log('form ', formattedChunk)
				result += formattedChunk;
				console.log('rest ', result);
				const msgObj: any = { sender_name: 'AI', message_text: result.replaceAll('AI:', '').replace('data: data: [DONE]', ''), prompt: tempQuestion };

				if(result){
					if (key) {
						// If key exists, update the message
						try {
							console.log('key', key)
		
							const index = tempMessages.findIndex(({ message_id }) => message_id === key);
							console.log('index', index, tempMessages[index]);
							tempMessages[index] = { ...msgObj, message_id: key } as Message;
							console.log('updated', tempMessages, tempMessages[index]);
		
						} catch (error) {
							console.error('Error updating message:', error);
						}
		
					} else {
						// Otherwise, insert a new message
						key = uuidv4();
						console.log('assigned key', key)
						tempMessages.push({ ...msgObj, message_id: key } as Message);
					}
					console.log('tempo', tempMessages);
					setMessages([...tempMessages]);
					setIsAnswerLoading(false)
				}
			}
		}
		setIsAnswerLoading(false)
	}


	const onSend = () => {
		onSentQuestion()
			// setMessages((prev:any) => [...prev, {message, name: "User", id: prev.length}]);
			// setMessage('')
	}

	useEffect(() => {
		if (isAnswerLoading) {
			const objDiv = document.querySelector(".chat__body")
			objDiv && objDiv.scrollTo({
				top: objDiv.scrollHeight,
				behavior: 'smooth',
			});
		} 
	}, [isAnswerLoading])
	

  return (
		<>
			<div className="circle" onClick={() => setIsChatOpen(!isChatOpen)}>
				{!isChatOpen ? "?" : <span className="close-icon"></span>}
			</div>
			{isChatOpen &&
				<Chat
					messages={messages}
					isAnswerLoading={isAnswerLoading}
					message={message}
					setMessage={setMessage}
					onSend={onSend}
				/>
			}
		</>
  );
};

export default App;
