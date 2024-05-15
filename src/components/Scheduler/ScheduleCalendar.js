import React, { Component } from 'react';
import 'dhtmlx-scheduler';
import 'dhtmlx-scheduler/codebase/dhtmlxscheduler.css';
import './Scheduler.css'
import { SERVER_URL } from '../../constants.js';
import { jwtDecode } from 'jwt-decode';
 
const scheduler = window.scheduler
scheduler.plugins({
    recurring: true,
    editors: true 
});

export default class ScheduleCalendar extends Component {

    initSchedulerEvents() {
       
        if (scheduler._$initialized) {
            return;
        }

        const onDataUpdated = this.props.onDataUpdated;
 
        scheduler.attachEvent('onEventAdded', (id, ev) => {
            const token = sessionStorage.getItem("jwt");
            if (onDataUpdated) {
                onDataUpdated('create', ev, id);
            }
            fetch(SERVER_URL + '/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : token
                },
                body: JSON.stringify(ev)
            })
            .then(response => response.text())
            .then(data => {
            if (data !== "Saved") {
            scheduler.deleteEvent(id);
            scheduler.message({
                text: "Новое событие не удалось создать. Создаваемое событие не может пересекаться по времени с уже существующими"
                + ", проводимыми в том же помещении (кроме персональных занятий) или тем же тренером", 
                type: "error",
                expire:30000
            })
            }
            })
            .catch(err => console.error(err))
        });
 
        scheduler.attachEvent('onEventChanged', (id, ev) => {
            const token = sessionStorage.getItem("jwt");
            if (onDataUpdated) {
                onDataUpdated('update', ev, id);
            }
            fetch(SERVER_URL + '/api/events/' + id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : token
                },
                body: JSON.stringify(ev)
            })
            .then(response => response.text())
            .then(data => {
            if (data !== "Updated") {
                scheduler.message({
                    text: "Обновляемое событие не может пересекаться по времени с уже существующими"
                    + ", проводимыми в том же помещении (кроме персональных занятий) или тем же тренером. Данное изменение" 
                    + " не будет отображаться другим сотрудникам. Устраните данную несостыковку самостоятельно или изменение не будет сохранено!", 
                    type: "warning",
                    expire:10000
                })
            }
            })
            .catch(err => console.error(err))
        });
 
        scheduler.attachEvent('onEventDeleted', (id, ev) => {
            const token = sessionStorage.getItem("jwt");
            if (onDataUpdated) {
                onDataUpdated('delete', ev, id);
            }
            fetch(SERVER_URL + "/api/events/" + id, {
                method: 'DELETE',
                headers: { 'Authorization' : token }
            })
            .then(() => {
                //
            });
        });
        scheduler.attachEvent("onBeforeEventChanged",function(dev){
            var parts = scheduler.getState().drag_id.toString().split("#");
            if (parts.length > 1) {
         
                var series = this.getEvent(parts[0]);
         
                series.start_date.setHours(dev.start_date.getHours());
                series.start_date.setMinutes(dev.start_date.getMinutes());
                series.event_length = (dev.end_date - dev.start_date) / 1000;
         
                setTimeout(function(){
                    scheduler.addEvent(series);
                }, 1);
         
                return false;
            }
            return true;
        });

        scheduler.attachEvent("onLightbox", function(id) {
            const token = sessionStorage.getItem("jwt");
            const decodedToken = jwtDecode(token);
            var lightbox = scheduler.getLightbox(); 
            lightbox.style.top = "80px";
            if(decodedToken.roles.toString() === 'ADMIN'){
            setTimeout(function() {
            var node = scheduler.formSection("Тип события").node;
            var radios = node.getElementsByTagName("input");
            // radios[0].checked = true;
            for (var i = 0; i < radios.length; i++) {
                radios[i].addEventListener("change", function() {
                    var data_type = this.value;
                    var url;
                    if (data_type === "тренировочное занятие") {
                        url = SERVER_URL + '/api/view_trainings';
                    } else if (data_type === "уборка и обслуживание") {
                        url = SERVER_URL + '/api/view_facilities';
                    }
                    fetch(url, {
                        headers: {
                              'Authorization' : token
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        var events
                        fetch(SERVER_URL + '/api/events', {
                            headers: {
                            'Authorization' : token
                            }
                        })
                        .then(response => response.json())
                        .then(eventsData => {
                            events = Object.values(scheduler._events)
                            var options;
                        if(data_type === "тренировочное занятие") {
                            options = data.filter(item => 
                                !events.some(event => event.text === 'Тренировка №' + item.idTraining + '. ' + item.name)
                            )
                            .map(item => ({
                                key: "Тренировка №" + item.idTraining + '. ' + item.name,
                                label: "Тренировка №" + item.idTraining + '. ' + item.name,
                            }));  
                        }
                        else{
                            options = data.filter(item => 
                                !events.some(event => event.text === "Уборка и обслуживание. " + item.name + " №" + item.idComplexFacility)
                            )
                            .map(item => ({
                                key: "Уборка и обслуживание. " + item.name + " №" + item.idComplexFacility,
                                label: "Уборка и обслуживание. " + item.name + " №" + item.idComplexFacility,
                             }));
                        }
                        scheduler.formSection("Событие").control.options.length = 0;
                        options.forEach(function(option) {
                            scheduler.formSection("Событие").control.options.add(new Option(option.label, option.key));
                        });
                        var event = scheduler.getEvent(id)
                        scheduler.formSection("Событие").setValue(event.text)
                        scheduler.formSection("Описание").setValue(event.description)
                        })
                        .catch(error => console.error(error));
                    })
                    .catch(err => console.error(err));
                });
            }
          }, 0);
        } else{
        }
        });      
        scheduler._$initialized = true;
        scheduler.i18n.setLocale("ru");
        scheduler.i18n.setLocale({
            labels:{
                message_cancel: "Отменить",
            }
        });

  }
  
     componentDidMount() {
        const token = sessionStorage.getItem("jwt");
        const decodedToken = jwtDecode(token);
        var events
        fetch(SERVER_URL + '/api/events', {
             headers: {
              'Authorization' : token
            }
        })
        .then(response => response.json())
        .then(data => {
            scheduler.parse(data, 'json');
            events = data
        })
        .catch(error => console.error(error));

        fetch(SERVER_URL + '/api/view_trainings', {
            headers: {
                  'Authorization' : token
                }
              })
              .then(response => response.json())
              .then(data => {
              fetch(SERVER_URL + '/api/user_profile?userLogin=' + decodedToken.sub, {
              headers: { 'Authorization' : token }
              })
              .then(response => response.json())
              .then(profileData => {
                let options;
                if (profileData.role === "COACH") {
                    options = data.filter(item => 
                        item.coach.userLogin === profileData.userLogin && 
                        !events.some(event => event.text === 'Тренировка №' + item.idTraining + '. ' + item.name)
                    )
                    .map(item => ({
                        key: "Тренировка №" + item.idTraining + '. ' + item.name,
                        label: "Тренировка №" + item.idTraining + '. ' + item.name,
                    }));
                } else {
                    options = data.filter(item => 
                        !events.some(event => event.text === 'Тренировка №' + item.idTraining + '. ' + item.name)
                    )
                    .map(item => ({
                        key: "Тренировка №" + item.idTraining + '. ' + item.name,
                        label: "Тренировка №" + item.idTraining + '. ' + item.name,
                    }));
                }
                scheduler.config.lightbox.sections = [
                    {   
                        name:"Событие", 
                        height:21, 
                        inputWidth:400, 
                        map_to:"text", 
                        type:"select", 
                        options: options,
                    },
                    {   
                      name:"Описание", 
                      height:21, 
                      inputWidth:800, 
                      default_value: "Новое событие",
                      map_to:"description", 
                      type:"textarea", 
                    },
                    decodedToken.roles.toString() === 'ADMIN' ? 
                    {
                    name: "Тип события",
                      height: 70,
                      type: "radio",
                      map_to: "data_type",
                      options: [
                          { id: "radio1", key: "тренировочное занятие", label: "Тренировочные занятия"} , 
                          { id: "radio2", key: "уборка и обслуживание", label: "Уборка/обслуживание сооружений и помещений комплекса" }
                      ],
                      vertical:true,
                    } :
                    {
                        name: "Тип события",
                        height: 21,
                        type:"textarea", 
                        map_to: "data_type",
                        default_value: "тренировочное занятие",
                        value: "тренировочное занятие",
                        disabled: true
                    },
                    {name:"recurring", height:115, type:"recurring", map_to:"rec_type", 
                    button:"recurring"},
                    {name:"time", height:72, type:"time", map_to:"auto"},
                ];
            })
              .catch(err => console.error(err));    
                // const options = data.map(item => ({
                //     key: "Тренировка №" + item.idTraining,
                //     label: "Тренировка №" + item.idTraining,
                // }));
                
                //   scheduler.config.lightbox.sections = [
                //       {   
                //           name:"Событие", 
                //           height:21, 
                //           inputWidth:400, 
                //           map_to:"text", 
                //           type:"select", 
                //           options: options,
                //       },
                //       {   
                //         name:"Описание", 
                //         height:21, 
                //         inputWidth:800, 
                //         map_to:"description", 
                //         type:"textarea", 
                //     },
                //     {
                //         name: "Тип события",
                //         height: 70,
                //         type: "radio",
                //         map_to: "data_type",
                //         options: [
                //             { id: "radio1", key: "тренировочное занятие", label: "Тренировочные занятия"} , 
                //             { id: "radio2", key: "уборка и обслуживание", label: "Уборка/обслуживание сооружений и помещений комплекса" }
                //         ],
                //         vertical:true
                //       },
                //       {name:"recurring", height:115, type:"recurring", map_to:"rec_type", 
                //       button:"recurring"},
                //       {name:"time", height:72, type:"time", map_to:"auto"},
                //   ];
              })
        .catch(err => console.error(err));

        scheduler.config.header = [
            'day',
            'week',
            'month',
            'date',
            'prev',
            'today',
            'next'
        ];
 
        this.initSchedulerEvents();

        scheduler.config.repeat_date = "%m/%d/%Y";
        scheduler.config.include_end_by = true;
        scheduler.config.hour_date = '%g:%i %A';
        scheduler.message.position = 'bottom'
        scheduler.xy.scale_width = 70;

        scheduler.init(this.schedulerContainer, new Date());
    }
    
    componentWillUnmount() {
      scheduler.clearAll();
    }

    shouldComponentUpdate(nextProps) {
        return this.props.timeFormatState !== nextProps.timeFormatState;
    }
 
    componentDidUpdate() {
        scheduler.render();
    }
 
    setTimeFormat(state) {
        scheduler.config.hour_date = state ? '%H:%i' : '%g:%i %A';
        scheduler.templates.hour_scale = scheduler.date.date_to_str(scheduler.config.hour_date);
    }
 
    render() {
        const { timeFormatState } = this.props;
        this.setTimeFormat(timeFormatState);
        return (
            <div
                ref={ (input) => { this.schedulerContainer = input } }
                style={ { width: '100%', height: '100%' } }
            />
        );
    }
}

// const ScheduleCalendar = ({ events }) => {
//     useEffect(() => {

//       scheduler.config.header = [
//         "day",
//         "week",
//         "month",
//         "date",
//         "prev",
//         "today",
//         "next"
//       ]
      
//       scheduler.init('scheduler_here', new Date(), 'month');

//       scheduler.parse(events, 'json');

//       return () => scheduler.clearAll();
//     }, [events]);

//     return (
//       <div id="scheduler_here" style={{ width: '100%', height: '100%' }}></div>
//     );
//   };
  
//   export default ScheduleCalendar;