"use client";

import * as z from "zod";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {DoctorTypes} from '@/lib/constants';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useUploadThing } from "@/lib/uploadthing";
import { isBase64Image } from "@/lib/utils";

import { UserValidation } from "@/lib/validations/doctor";
import { updateDoctor } from "@/lib/actions/admin.actions";
import Link from "next/link";

interface Props {
  doctor: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    phonenumber: string;
    isVerified: boolean;
    speciality: string;
    emergency: string;
  };
}

const DoctorProfile = ({ doctor }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { startUpload } = useUploadThing("media");

  const [files, setFiles] = useState<File[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);


  const form = useForm<z.infer<typeof UserValidation>>({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: doctor?.image ? doctor.image : "",
      name: doctor?.name ? doctor.name : "",
      username: doctor?.username ? doctor.username : "",
      bio: doctor?.bio ? doctor.bio : "",
      emergency: doctor?.emergency ? doctor.emergency : "no",
      phonenumber: doctor?.phonenumber ? doctor.phonenumber : "",
      speciality: doctor?.speciality
        ? doctor.speciality
        : "Please select your speciality",
    },
  });
  console.log("DOCTOR_PROFILE", doctor);
  const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    const blob = values.profile_photo;

    const hasImageChanged = isBase64Image(blob);
    if (hasImageChanged) {
      const imgRes = await startUpload(files);

      if (imgRes && imgRes[0].url) {
        values.profile_photo = imgRes[0].url;
      }
    }

    await updateDoctor({
      name: values.name,
      path: pathname,
      username: values.username,
      userId: doctor.id,
      bio: values.bio,
      image: values.profile_photo,
      phonenumber: values.phonenumber,
      isVerified: doctor.isVerified,
      speciality: values.speciality,
      emergency: values.emergency
    });
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 7000);
  };

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col justify-start gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
      {showSuccessMessage && (
        <div className="bg-green-200 text-green-800 p-4 rounded mt-4">
          Profile updated successfully!
        </div>
      )}

        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label">
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="profile_icon"
                    width={96}
                    height={96}
                    priority
                    className="rounded-full object-contain"
                  />
                ) : (
                  <Image
                    src="/assets/profile.svg"
                    alt="profile_icon"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Add profile photo"
                  className="account-form_image-input"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Name
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Username
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phonenumber"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Phonenumber
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
<FormField
  control={form.control}
  name="emergency"
  render={({ field }) => (
    <FormItem className="flex w-full flex-col gap-3">
      <FormLabel className="text-base-semibold text-light-2">
        Do You Provide Emergency?
      </FormLabel>
      <FormControl>
      <Select onValueChange={field.onChange} defaultValue={doctor.emergency}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder={field.value} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
            <SelectItem  value="yes">
              yes
            </SelectItem>
            <SelectItem  value="no">
              no
            </SelectItem>
        </SelectContent>
      </Select>


      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="speciality"
  render={({ field }) => (
    <FormItem className="flex w-full flex-col gap-3">
      <FormLabel className="text-base-semibold text-light-2">
        Speciality
      </FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder={field.value} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {DoctorTypes.map((type, index) => (
            <SelectItem key={index} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" 
                          className="w-full mt-10 px-4  py-2 bg-transparent border-2 border-gray-800 text-gray-800 font-bold rounded"

        >
          Submit
        </Button>
        <Link
                  href={`/doctor-upload`}
                  className="w-full mt-10 px-4  py-2 bg-transparent border-2 border-gray-800 text-gray-800 font-bold rounded"
                >
           Upload your documents
          </Link>
      </form>
    </Form>
  );
};

export default DoctorProfile;