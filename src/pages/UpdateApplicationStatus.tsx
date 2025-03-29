import { applicationsApi } from '@/api/applications.api';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Toast } from "primereact/toast";

function UpdateApplicationStatus() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const status = searchParams.get('status')
    const navigate = useNavigate()
    const toast = useRef<Toast>(null);


    const updateApplication = async (mainDis: string, status: string) => {
        const res = await applicationsApi.updateApplicationStatus(mainDis, status as any);
        navigate('/')
        toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: res?.message
        });
    }

    useEffect(() => {
        if (id && status) {
            updateApplication(id, status as any)
        }
    }, [id])

    if (!id) {
        return <div>Invalid request: Missing application ID</div>;
    }

    return (
        <ProgressSpinner />

    );
}

export default UpdateApplicationStatus;