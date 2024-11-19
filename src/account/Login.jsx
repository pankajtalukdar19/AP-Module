import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { authActions } from '_store';
import authService from 'service/authService';

export { Login };

function Login() {
    const dispatch = useDispatch();

    // form validation rules 
    const validationSchema = Yup.object().shape({
        email: Yup.string().required('email is required'),
        password: Yup.string().required('Password is required')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    const onSubmit = async (data) => {
        try {
            // await dispatch(authActions.login({ email, password }));
           const res =  await authService.login(data)
            console.log();
            const user = res?.data?.data
            dispatch(authActions.setAuth(user));
            localStorage.setItem('auth', JSON.stringify(user));
            
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <div className="card m-3">
            <h4 className="card-header">Login</h4>
            <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label className="form-label">email</label>
                        <input name="email" type="text" {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.email?.message}</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.password?.message}</div>
                    </div>
                    <button disabled={isSubmitting} className="btn btn-primary">
                        {isSubmitting && <span className="spinner-border spinner-border-sm me-1"></span>}
                        Login
                    </button>
                    <Link to="../register" className="btn btn-link">Register</Link>
                </form>
            </div>
        </div>
    )
}
