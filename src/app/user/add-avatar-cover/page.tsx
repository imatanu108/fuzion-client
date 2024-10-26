"use client"

import ImageUpload from "@/components/user/ImageUploadForm";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const RegistrationPage: React.FC = () => {
    const router = useRouter()
    return (
        <>
            <ImageUpload />

            <div className="flex justify-center items-center">
                <Button
                    variant={"default"}
                    size={"default"}
                    className="text-lg bg-[#114762] mt-10 text-slate-50 w-32 rounded-full"
                    onClick={() => router.push('/')}
                >
                    Finish
                </Button>
            </div>


        </>
    );
};

export default RegistrationPage;