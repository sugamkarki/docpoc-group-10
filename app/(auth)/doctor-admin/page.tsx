import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchDoctor } from "@/lib/actions/admin.actions";
import DoctorProfile from "@/components/forms/DoctorProfile";

async function Page() {
  const user = await currentUser();
  if (!user) return null; // to avoid typescript warnings

  const userInfo = await fetchDoctor(user.id);
  if (userInfo?.onboarded) redirect("/");

  const userData = {
    id: user.id,
    objectId: userInfo?._id,
    username: userInfo ? userInfo?.username : user.username,
    name: userInfo ? userInfo?.name : user.firstName ?? "",
    bio: userInfo ? userInfo?.bio : "",
    image: userInfo ? userInfo?.image : user.imageUrl,
    phonenumber:userInfo? userInfo?.phonenumber : "",
    isVerified: userInfo? userInfo?.isVerified : "",
    speciality: userInfo? userInfo?.speciality: ""
  };

  return (
    <main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-20'>
      <h1 className='head-text'>Doctor Admin Panel</h1>
      <p className='mt-3 text-base-regular text-light-2'>
        Complete your profile now, to use Threds.
      </p>
      <DoctorProfile doctor={userData} btnTitle='Continue' />

      <section className='mt-9 bg-dark-2 p-10'>
      </section>
    </main>
  );
}

export default Page;