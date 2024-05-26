import { useEffect, useState } from "react";
import './Scheduler.css';
import './Toolbar.css';
import Toolbar from "./Toolbar.js"
import ScheduleCalendar from "./ScheduleCalendar.js"

const Scheduler = ({ setSelectedLink, link }) => {

    useEffect(() => {
        setSelectedLink(link);
      }, []);
    
	const [currentTimeFormatState, setTimeFormat] = useState(true);

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
				/>
			</div>
		</div>
	);
}
export default Scheduler;