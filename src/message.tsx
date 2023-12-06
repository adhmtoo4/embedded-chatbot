import React from "react";

export const MessageSimple = ({message, isUser, profilePicture, userName, chatSize}:any) => {
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
    </div>
	)
}