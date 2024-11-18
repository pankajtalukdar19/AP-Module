import { useForm,  } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import keyService from "../service/keyService";
import { useEffect, useState } from "react";

const Setting = () => {
    const [id, setId] = useState('');
    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        key: Yup.string().required('Key is required')
    });
    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(validationSchema)
    });


    const fetchKeys = async () => {
        const response = await keyService.getKey();
        if (response?.data?.data) {
            const initialData = response.data.data[0];
            setValue('username', initialData.username);
            setValue('key', initialData.key);
            setId(initialData._id)
        }
    };
    useEffect(() => {
        fetchKeys();
    }, []); 

    const onSubmit = async (data) => {
        try {
            console.log(data);
            
            const response = await keyService.getKeyById(id, data);
            if (response?.data?.success) {
                fetchKeys()
            } else {
                console.error('Failed:', response?.data?.msg || 'Error');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
 // Only re-run when setValue changes

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="card m-3">
            <h4 className="card-header">Change Key</h4>
            <div className="card-body">
                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                        name="username"
                        type="text"
                        {...register('username')} // register the field
                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.username?.message}</div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Key</label>
                    <input
                        name="key"
                        type="text"
                        {...register('key')} // register the field
                        className={`form-control ${errors.key ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.key?.message}</div>
                </div>
                <button disabled={isSubmitting} className="btn btn-primary">
                    {isSubmitting && <span className="spinner-border spinner-border-sm me-1"></span>}
                    Submit
                </button>
            </div>
        </form>
    );
};

export default Setting;