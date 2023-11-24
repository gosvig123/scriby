"use client";
import Image from "next/image";
import Link from "next/link";
import TypewriterComponent from "./effects/Typewriter";
export default function HomeContent() {
  return (
    <div className="flex flex-col md:flex-row w-min-full md:mt-10  ">
      <div className="flex-grow flex flex-1 justify-center items-center">
        <div className="flex px-10 flex-col align-center mt-10 justify-center gap-7 ">
          <p className="text-5xl purpleText  mt-5 ">
            Transcription ... <br /> Made Simple!
          </p>

          <p className="purpleText fontWeight-bold  text-2xl">
            Transcription has never been easier.
            <br /> Simply upload your audio file and we'll do the rest!
          </p>
          <Link href="/signup">
            <button className="w-44 mt-9 pBackground text-white py-2 px-4 rounded-md ">
              Try For Free
            </button>
          </Link>
          <div className="mt-10 flex align-center justify-center">
            <Image
              src="/avatar.png"
              alt="avatar"
              width={50}
              height={50}
              className="rounded-full"
            />
            <Image
              src="/avatar2.png"
              alt="avatar"
              width={50}
              height={50}
              className="rounded-full"
            />
            <Image
              src="/avatar1.png"
              alt="avatar"
              width={50}
              height={50}
              className="rounded-full"
            />

            <p className="text-xl font-roboto text-gray-500 ml-3 ">
              {" "}
              50K Have Already Joined
            </p>
          </div>
        </div>
      </div>
      <div className="flex-grow flex-1 flex justify-around  items-center flex-col ">
        <div className=" bg-white self-end mr-36 flex rounded-xl pr-10 pl-2 py-2 shadow-2xl">
          <Image
            src="/avatar.png"
            alt="avatar"
            width={50}
            height={40}
            className="rounded-full"
          />
          <div className="flex flex-col justify-center items-center ml-4">
            <p className="text-sm font-roboto text-gray-500 border-b-2 border-slate-800 text-center">
              Julia Smith
            </p>
            <p className="text-center text-xs">
              Absolute love Sriby now I have time to do my actual job{" "}
            </p>
          </div>
        </div>
        <TypewriterComponent
          baseText="Scriby Transcription Ai is helping you with "
          rotatingText={[
            "+100 languages",
            "Transcription with bad sounds",
            "Industry leading accuracy",
          ]}
        />
      </div>
    </div>
  );
}
