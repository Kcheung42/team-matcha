import React, { Component } from 'react';
import momentTZ from "moment-timezone";
import { Box } from '@material-ui/core';
import { disableDays } from '../../Utils/dates-func';
// importing components
import CalendarEventMobile from './CalendarEvent/CalendarEventMobile';
import CalendarEvent from './CalendarEvent/CalendarEvent';
import Calendar from './Calendar/Calendar';
import ConfirmModal from './ConfirmModal/ConfirmModal';
import TimeSlotMobileList from './TimeSlotMobileList/TimeSlotMobileList';

class CalendarPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            date: new Date(),
            dateSelectedFormatted: '',
            maxdate: momentTZ().add(90, 'd'),
            availability: {},
            timezoneName: momentTZ.tz.guess(true),
            timezonesArr: momentTZ.tz.names(),
            timeslots: [],
            timeSlotSelected: '',
            timeSlotSelected24hr: '',
            showConfirmModal: false,
            showTimeSlotSlider: false
        }
    }

    componentDidMount(){
        this.handleFetchEvent();
        this.handleFetchCalendar();
    }

    handleFetchEvent = () => {
        // /users/{public_id}/events/{event_url}
        const { public_id, eventLink } = this.props.match.params; // get params from url
        fetch(`/users/${public_id}/events/${eventLink}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'X-access-token': token
            }
            })
            .then(data => data.json())
            .then((eventData) => {
                console.log(eventData);
            })
            .catch(err => (err));
    }

    handleFetchCalendar = () => {
        // /users/{public_id}/events/{event_url}
        const { public_id, eventLink } = this.props.match.params; // get params from url
        fetch(`/users/${public_id}/events/${eventLink}/calendar`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'X-access-token': token
            }
            })
            .then(data => data.json())
            .then((calendarData) => {
                // console.log('calendar data', calendarData);
                this.setState({ availability: calendarData });
            })
            .catch(err => (err));
    }

    // method: handles date change and time-slots to render
    handleDateChange = (date) => {
        this.setState({   
            date: date, 
            timeslots: this.state.availability[date.format('YYYY-MM-DD')]
            }, () => console.log(this.state)
        );
        const { public_id, eventLink } = this.props.match.params; // get params from url
        const monthQuery = date.format('YYYY-MM'); // set month query url-param
        const dateQuery = date.format('YYYY-MM-DD'); // set date query url-param
        this.props.history.push(`/${public_id}/${eventLink}?month=${monthQuery}&date=${dateQuery}`); // onChange set url
    };

    // method: handles date change and time-slots to render
    handleMobileDateChange = (date) => {
        this.setState((prevState) => {
            return {
                date: date, 
                timeslots: this.state.availability[date.format('YYYY-MM-DD')],
                showTimeSlotSlider: !prevState.showTimeSlotSlider
            }
        }, () => console.log(this.state));
        const { public_id, eventLink } = this.props.match.params; // get params from url
        const monthQuery = date.format('YYYY-MM'); // set month query url-param
        const dateQuery = date.format('YYYY-MM-DD'); // set date query url-param
        this.props.history.push(`/${public_id}/${eventLink}?month=${monthQuery}&date=${dateQuery}`); // onChange set url
    };

    // method: disables days
    handleDisableDates = (date) => {
        const days = disableDays(this.state.availability);
        const dateFound = days.find((dayStr) => {
            return date.format('YYYY-MM-DD') === dayStr;
        });
        return dateFound;
    };

    handleConfirmModal = (time, time24hr, dateFormatted) => {
        this.setState((prevState) => {
            return {
                timeSlotSelected: time,
                timeSlotSelected24hr: time24hr,
                showConfirmModal: !prevState.showConfirmModal,
                dateSelectedFormatted: dateFormatted
            }
        });
    };

    handleConfirmation = () => {
        const { public_id, eventLink } = this.props.match.params;
        const monthQuery = momentTZ(this.state.dateSelectedFormatted).format('YYYY-MM'); // set month query url-param
        const dateQuery = momentTZ(this.state.dateSelectedFormatted).format('YYYY-MM-DD'); // set date query url-param
        this.props.history.push(`/${public_id}/${eventLink}/${this.state.dateSelectedFormatted}?month=${monthQuery}&date=${dateQuery}`); // redirect to confirmation page
    };

    // method: gets the users text-input & dropwDown selection values
    handleUserInput = e => {
        const { value, name } = e.target;
        this.setState({ [name]: value }, () => console.log(this.state));
    };

    handleCloseSlider = () => (this.setState({ showTimeSlotSlider: false }));
    
    render(){
        return (
            <Box className="calendarPage">
                <Box boxShadow={3} className="calendarPage__container">
                {/*slider start*/}
                { this.state.showTimeSlotSlider ?
                    <Box className="calendarPage__slider">
                        <CalendarEventMobile 
                            timezoneName={this.state.timezoneName}
                            timezonesArr={this.state.timezonesArr}
                            handleUserInput={this.handleUserInput}
                            handleCloseSlider={this.handleCloseSlider}
                        />
                        <TimeSlotMobileList 
                            date={this.state.date} 
                            timeslots={this.state.timeslots} 
                            timezoneName={this.state.timezoneName} 
                            handleTimeSlotSelected={this.handleTimeSlotSelected} 
                            handleConfirmModal={this.handleConfirmModal}
                        />
                </Box> : null
                }
                {/*slider end*/}
                <div className="ribbon ribbon-top-right"><span>Powered By<br/>CalendApp</span></div>
                    <CalendarEvent
                        timezoneName={this.state.timezoneName}
                        timezonesArr={this.state.timezonesArr}
                        handleUserInput={this.handleUserInput}
                    />
                    <Calendar 
                        date={this.state.date}
                        maxDate={this.state.maxdate}
                        timeslots={this.state.timeslots}
                        timezoneName={this.state.timezoneName}
                        handleDisableDates={this.handleDisableDates}
                        handleDateChange={this.handleDateChange}
                        handleMobileDateChange={this.handleMobileDateChange}
                        handleConfirmModal={this.handleConfirmModal}
                        handleTimeSlotSelected={this.handleTimeSlotSelected}
                    />
                </Box>
                { this.state.showConfirmModal 
                    ? <ConfirmModal 
                        timeSlotSelected={this.state.timeSlotSelected} 
                        handleConfirmModal={this.handleConfirmModal}
                        handleConfirmation={this.handleConfirmation}
                        /> : null }
            </Box>
        )
    }
}

export default CalendarPage;
