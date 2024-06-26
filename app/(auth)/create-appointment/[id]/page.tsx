"use client";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { currentUser } from "@clerk/nextjs";
import { parse, format } from 'date-fns';
import { useState, useEffect } from "react";
import { getAppointmentbyDoctor } from "@/lib/actions/appointment.actions";

import { useClerk } from "@clerk/nextjs";
import { createAppointment } from "@/lib/actions/appointment.actions";
import NavBars from "@/components/navbars/NavBars";
import Link from "next/link";
import { fetchDoctorById } from "@/lib/actions/doctor.actions";

const Page = ({ params }: { params: { id: string } }) => {
  // const params = useParams();
  const clerk = useClerk();
  const currentUser = clerk.user;
  console.log(params.id);
  let newEvents: any[] = []; // Explicitly declare the type of newEvents
  const [events, setEvents] = useState<any[]>([]);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null); // State to store selected date and time

  const [slotMinTime, setSlotMinTime] = useState("09:00");
  const [slotMaxTime, setSlotMaxTime] = useState("17:00");

  
  useEffect(() => {
    async function fetchAppointments() {
      try {
        const newDoctorId = params.id;
        const appointments = await getAppointmentbyDoctor({ doctor_id: newDoctorId });
        const doctordata =  await fetchDoctorById(params.id);
        if(doctordata && doctordata.emergency != null){
          const isEmergencyYes = doctordata.emergency === 'yes';

          if (isEmergencyYes) {
            setSlotMinTime("00:00");
            setSlotMaxTime("24:00");
          } else {
            setSlotMinTime("09:00");
            setSlotMaxTime("17:00");
          }
  
        }else{
          setSlotMinTime("09:00");
          setSlotMaxTime("17:00");
        }


        const dates = appointments.map((appointment) => appointment.appointment_date);
        console.log(dates);
        
  
  
        
        appointments.forEach((appointment) => {
      let newDate = new Date(appointment.appointment_date);
      let convert =newDate.toISOString().slice(0, 10);

    
      let time= appointment.appointment_time;
      const parsedTime = parse(time, 'h:mm:ss a', new Date());
      const formattedTime = format(parsedTime, 'HH:mm:ss');
      console.log(formattedTime);
      console.log(convert);
      newEvents.push({
              title: "booked",
              start: convert+"T"+formattedTime,
              end: convert+"T"+formattedTime,

              color: "red"
          });
      });

      setEvents(newEvents);
      
        console.log("events");
        console.log(newEvents);
  
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    }
  
    fetchAppointments();
  }, []);
  

  const handleEventClick = async (arg: any) => {
    async function fetchAppointments() {
      try {
        const newDoctorId = params.id;
        const appointments = await getAppointmentbyDoctor({ doctor_id: newDoctorId });
        const dates = appointments.map((appointment) => appointment.appointment_date);
        console.log(dates);
        
  
  
        
        appointments.forEach((appointment) => {
      let newDate = new Date(appointment.appointment_date);
      let convert =newDate.toISOString().slice(0, 10);

    
      let time= appointment.appointment_time;
      const parsedTime = parse(time, 'h:mm:ss a', new Date());
      const formattedTime = format(parsedTime, 'HH:mm:ss');
      console.log(formattedTime);
      console.log(convert);
      newEvents.push({
              title: "booked",
              start: convert+"T"+formattedTime,
              end: convert+"T"+formattedTime,

              color: "red"
          });
      });

      setEvents(newEvents);
      
        console.log("events");
        console.log(newEvents);
  
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    }

    const clickedDate = arg.date;
    console.log(currentUser?.id);
    if (clickedDate < new Date()) {
      alert("You cannot select a time slot in the past.");
    } else {
      const formattedDate = clickedDate.toLocaleDateString();
      const formattedTime = clickedDate.toLocaleTimeString();
      console.log(
        currentUser?.id +
          " " +
          params.id +
          " " +
          formattedDate +
          " " +
          formattedTime
      );
      const appointmentObject = {
        doctor_id: params.id,
        patient_id: currentUser!.id,
        appointment_date: formattedDate,
        appointment_time: formattedTime,
        
      };
      try {
        await createAppointment(appointmentObject);
        fetchAppointments();

      } catch (err: any) {
        alert(err.message);
      }
      console.log(appointmentObject);
    }
  };

  const handleSlotLabelMount = (arg: any) => {
    const rowEl = arg.el.closest(".fc-timegrid-slots tr") as HTMLElement | null; // Find the closest row element
    const rowEl1 = arg.el.closest(
      ".fc-timeGridWeek-view"
    ) as HTMLElement | null; // Find the closest row element
    if (rowEl) {
      rowEl.style.height = "100px"; // Set row height
    }
  }; // Run this effect only once after initial render

  return (
    <>
      <NavBars/>
    <div className="cal_appt" style={{ backgroundColor: 'white', height: '100%', width: '100%' }}>
          
      <FullCalendar 
      allDayClassNames="cal_allday"
        dayCellClassNames="cell"
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          start: "title",
          center: "",
          end: "today prev next",
        }}
        height="400px" // Set calendar height to 100% of viewport height
        contentHeight="auto" // Allow calendar to determine its own height based on content
        events={events}
        dateClick={handleEventClick}
        slotMinTime={slotMinTime}
        slotMaxTime={slotMaxTime}
        slotDuration="01:00:00" // Set slot duration to 1 hour
        slotLabelDidMount={handleSlotLabelMount}
        slotLabelContent={(arg: any ) => {
          const hour = arg.date.getHours();
          return `${hour}:00 - ${hour + 1}:00`; // Format slot label as "9:00 - 10:00"
        }} // Custom slot label format
      />
      </div>
        <br></br>
              <Link
                  href={`/details-doctor/${params.id}`}
                  className="w-full mt-10 px-4  py-2 bg-transparent border-2 border-gray-800 text-gray-800 font-bold rounded"
                >
                  Go Back
                </Link>
             
    </>
  );
};

export default Page;
