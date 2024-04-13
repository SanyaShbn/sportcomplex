import { useEffect, useState } from "react";
import './Scheduler.css';
import './Toolbar.css';
import './MessageArea.css';
import Toolbar from "./Toolbar.js"
import MessageArea from "./MessageArea.js"
import ScheduleCalendar from "./ScheduleCalendar.js"
// import { SERVER_URL } from '../../constants.js';

const Scheduler = ({ setSelectedLink, link }) => {

	// const [events, setEvents] = useState([]); 

    useEffect(() => {
        setSelectedLink(link);
		// fetchEvents();
      }, []);

	//   const fetchEvents = () => {
	// 	// const token = sessionStorage.getItem("jwt");
	// 	fetch(SERVER_URL + '/api/events', {
	// 	//   headers: { 'Authorization' : token }
	// 	})
	// 	.then(response => response.json())
	// 	.then(data => {
	// 		setEvents(data._embedded.events)
	//     })
	// 	.catch(err => console.error(err)); 
	// }
    
	const [currentTimeFormatState, setTimeFormat] = useState(true);
	const [messages, setMessages] = useState([]);

	function addMessage(message) {
		setMessages((arr) => [...arr, message]);
	}

	function logDataUpdate(action, ev, id) {
		const text = ev && ev.text ? ` (${ev.text})` : "";
		const message = `event ${action}: ${id} ${text}`;
		addMessage(message);
	}

	return (
		<div>
			<div className="tool-bar">
				<Toolbar
					timeFormatState={currentTimeFormatState}
					onTimeFormatStateChange={setTimeFormat}
				/>
			</div>
			<div className="scheduler-container">
				<ScheduleCalendar
					timeFormatState={currentTimeFormatState}
					onDataUpdated={logDataUpdate}
				/>
			</div>
			<div className="message-area">
			<MessageArea messages={messages} />
			</div>
		</div>
	);
}
export default Scheduler;