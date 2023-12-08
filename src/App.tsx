import React, {useState, useEffect} from "react";
import { v4 as uuidv4 } from 'uuid';
import { Message } from "./models/common";
import Chat from "./Chat";

const App = () => {
	const embeddedChatbotID = (window as any).embeddedChatbotID || "d4392904-a2b1-4d1a-bf0e-c024fdd5d708";
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState(() => {
		const savedMessages = localStorage.getItem('chatMessages');
		return savedMessages ? JSON.parse(savedMessages) : [{
			sender_name: 'AI',
			message_text: 'Hello! How can I help you?',
			message_id: '0'
		}];
	});
	const [isAnswerLoading, setIsAnswerLoading] = useState(false);
	const [error, setError] = useState("");
	console.log(error);
	const [isChatOpen, setIsChatOpen]= useState(false);
	useEffect(() => {
		localStorage.setItem('chatMessages', JSON.stringify(messages));
	}, [messages]);
	
  	const onSentQuestion = async () => {
		setIsAnswerLoading(true)
		const tempQuestion:any = message;
		
		const tempMessages = [...messages, {message_text: message, sender_name: "User", message_id: uuidv4()}];
		setMessages(tempMessages);
		setMessage('')
		const response = await fetch(`${process.env.REACT_APP_URL_SSL || 'https://dev.await.ai'}/embedded_chatbot_question`, {
			method: "POST",
			headers: {
				Accept: 'text/event-stream,application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				"question": tempQuestion,
				messages,
				is_org: false,
				chatbot_id: embeddedChatbotID
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

			if (chunk) {
					if (!chunk.startsWith('STARTSOURCES')) {
							if (!chunk.startsWith('data:')) chunk = `{data: {"id":"${chunk}`;
							formattedChunk = chunk.trim().split('data: ').filter((ele) => ele !== '' && !ele.includes('[DONE]')).map((ele: any) => {
									ele = ele.trim();
									if (ele.charAt(ele.length - 1) === '}') {
											try {
													return JSON.parse(ele)?.choices?.[0]?.delta?.content ?? '';
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
					if (key) {
						// If key exists, update the message
						try {
							console.log('key', key)
		
							// eslint-disable-next-line no-loop-func
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
