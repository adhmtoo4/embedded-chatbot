import React from "react";
import { MessageSimple } from "./message";
import { TelegramChatIcon } from "./styles/icons/icons";

export default function Chat ({messages, isAnswerLoading, message, setMessage, onSend}:any) {
	return(
		<div className="chat wrapper">
		<div className="chat__header">
			<div className="chat__title">Try Your KB here</div>
		</div>
		
		<div className="chat__body">
			<div className="chat__messages" style={{paddingBottom: '50px'}}>
				{messages.map(({message_id, message_text, sender_name}:any) => {
					return "User" === sender_name ? (
						<div
							className={`flex flex-col items-end item-message`}
							key={message_id}
							id={message_id}
						> 
							<MessageSimple
								message={message_text}
								// userName={user.fullName}
								// profilePicture={user.photoUrl}
								isUser
							/>
						</div>
					) : (
						<div 
							className={`flex flex-col items-start item-message`}
							key={message_id}
							id={message_id}
						>
							<MessageSimple
								message={message_text}
								// userName={user.fullName}
								// profilePicture={user.photoUrl}
								isUser={false}
							/>
						</div>);
				}
				)}

			</div>

			{isAnswerLoading
				? <div className='flex flex-col items-start loading'>
						<div>
							<div className='message-container'>
								<div>
									{/* <img src={robot} /> */}
								</div>

								<div className='message'>
									<div className='text ai' style={{padding: '10px 30px'}}>
										<div className="dot-flashing"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
					: <></>}

					
			<div className="chat__input">
				{/* <div className="chat__icon">
					<AttachFileIcon />
				</div> */}

				<textarea
					placeholder="Type message here"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				>
				</textarea>
					<button
						className="chat__icon"
						type="button"
						disabled={message.trim().length===0}
						onClick={onSend}
					>
						<TelegramChatIcon />
					</button>
			</div>
		
		</div>
	</div>
	)
}