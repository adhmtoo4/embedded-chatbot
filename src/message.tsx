import React, { useEffect, useState } from "react";
import Sources from "./Sources";

export const MessageSimple = ({message_text, isUser, profilePicture, userName, chatSize}:any) => {
	const [message, setMessage] = useState<string>('');
	const [sources, setSources] = useState<string>('');
	useEffect(() => {
		
		if(message_text === null){
			return;
		}
		const result: any = message_text?.match(/STARTSOURCES([\s\S]*?)STOPSOURCES/);
		if (result) {
			let tempMessage = message_text.replaceAll(result[0], '');
			setMessage(tempMessage);
			setSources(result[1])
		} else {
			setMessage(message_text)
		}
	}, [message_text])
	console.log('message,', sources);
	return (
		<div className="">
			<div className={`message-container ${isUser ? 'user' : ''}`}>
				<div>
					{!isUser && <div className={`robot-md ${chatSize === 'small' ? "robot-md-small" : chatSize === 'medium' ? "robot-md-medium": "robot-md-large"}`}></div>}
						
				</div>
				{message &&
					<div className='message'>
						<div style={{display: 'flex', flexDirection: isUser ? 'row-reverse' : 'row', alignItems: 'center'}}>
							<div className={`text ${!isUser ? 'ai' : ''}`} style={{padding: '10px'}}>
								{message}
							</div>
						</div>
					</div>
				}			
				</div>
				{sources && (
							<div className="bg-indigo-100 rounded-sm px-3 py-2 mt-2">
								<Sources sources={sources} />
							</div>
						)}
    </div>
	)
}