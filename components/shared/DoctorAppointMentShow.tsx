"use client";
import { NavLinksLanding } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Params {
  id: string;
  doctor_id: string;
  patient_id: string;
  appointment_date: Date;
  appointment_time: string;
  patient_name: string;
  doctor_name: string;
}
const DoctorAppointMentShow = ({
  id,
  doctor_id,
  patient_id,
  appointment_date,
  appointment_time,
  patient_name,
  doctor_name,
}: Params) => {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <div className="max-w-md mx-auto flex justify-center bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-3">
      <div className="md:flex">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            Patient Name {patient_name}
          </div>
          <p className="block mt-1 text-lg leading-tight font-medium text-black">
            Appointment Time: {appointment_time}
          </p>
          <p className="block mt-1 text-lg leading-tight font-medium text-black">
            Appointment Date: {appointment_date.toLocaleDateString()}
          </p>

          <p className="mt-2 text-gray-500">{doctor_name}</p>
         

        <div className="flex flex-col  justify-center">
          
          <Link
            href={{
              pathname: "/doctor-delete-appointment",
              query: {
                id: id,
                doctor_id: doctor_id,
                patient_id: patient_id,
                doctor_name: doctor_name,
                patient_name: patient_name,
                appointment_date: appointment_date.toLocaleDateString(),
                appointment_time: appointment_time,
              },
            }}
            className="mt-5 ml-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Cancel Appointment
          </Link>
          <Link
            href={{
              pathname: "/doctor-chat",
              query: {
                id: id,
                doctor_id: doctor_id,
                patient_id: patient_id,
              },
            }}
            className="mt-5 ml-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yello-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Start a Chat
          </Link>

          <Link
            href={{
              pathname: "/video",
              query: {
                id: id,
                patient_id: patient_id,
              },
            }}
            className="mt-5 ml-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yello-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Video
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DoctorAppointMentShow;
