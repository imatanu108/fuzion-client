"use client"

import ImageUpload from "@/components/user/ImageUploadForm";
import { useRouter } from "next/navigation";
import UpdateDetailsForm from "@/components/user/UpdateDetailsForm";

const EditProfilePage: React.FC = () => {
    return (
        <>
            <ImageUpload />
            <UpdateDetailsForm />
        </>
    );
};

export default EditProfilePage;