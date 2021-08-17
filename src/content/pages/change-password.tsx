import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import { ValidationError } from '../../components/form/validation-error.component'

import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import {toast} from 'react-toastify'
import { useDispatch } from 'react-redux'
// import {
//     StatusCodes
// } from 'http-status-codes';
import { useHistory, useParams } from 'react-router';
import { authService } from '../../services';
import { userService } from '../../services/user.service';
import { Button, CircularProgress, TextField, Zoom } from '@material-ui/core';
import { useSnackbar } from 'notistack';

const schema = yup.object().shape({
    password: yup.string().required().min(8).label('Password'),
    confirmPassword: yup.string().required().min(8).label('Confirm Password')
});

export const ChangePasswordComponent = () =>  {

    const params = useParams();
    const history = useHistory();
    const dispatch = useDispatch()

    
    const { register, handleSubmit, formState:{ errors } } = useForm({
        resolver: yupResolver(schema)
    });
  
    const [loading, setLoading] = useState(false);
    const [sErrors, setSErrors] = useState({})

    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [error2, setError2] = useState('');
    const { enqueueSnackbar } = useSnackbar();

    const validationError = (name) => {
        let message = '';
        if (errors && errors[name] && errors[name].message) message = errors[name].message;
        if (sErrors && sErrors[name]) message = sErrors[name];
        return ( message ) ? <ValidationError error={message}/> : <></>
    }

    const onSubmit = (value) => {
        if (value.password !== value.confirmPassword) return setSErrors({ confirmPassword: 'Password does not matched!'})
        setLoading(true)
        userService.updatePassword({...value }).then(( {data} ) => {
            setLoading(false)
            toast.success(data.message);
        }, ({ response }) => {
            setLoading(false)
            console.log(response.status)
            switch(response.status) {
                case 404:
                    console.log(response.data.message)
                // case StatusCodes.NOT_FOUND:
                //     toast.error(response.data.message)
                //     break;
            }

        })
    }

    const onSubmit2 = () => {
        if(password !== passwordConfirm) setError('Password does not matched!');
        else if(password.trim().length < 8) setError('Password must be at least 8 characters');
        else if(passwordConfirm.trim().length < 8) setError2('Confirm Password must be at least 8 characters');
        else{
            setLoading(true);
            let data={
                'password': password,
                'confirmPassword': passwordConfirm
            }
            userService.updatePassword(data).then(( {data} ) => {
                setLoading(false)
                // toast.success(data.message);
                setPassword('');
                setPasswordConfirm('');
                enqueueSnackbar(data.message, {
                    variant: 'success',
                    anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right'
                    },
                    TransitionComponent: Zoom
                  });
            }, ({ response }) => {
                setLoading(false)
                console.log(response.status)
                switch(response.status) {
                    case 404:
                        console.log(response.data.message);
                        enqueueSnackbar(response.data.message, {
                            variant: 'error',
                            anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right'
                            },
                            TransitionComponent: Zoom
                        });
                        break;
                    // case StatusCodes.NOT_FOUND:
                    //     toast.error(response.data.message)
                    //     break;
                }

            })
        }
    }
    return (
        <React.Fragment>
            <h2>Change Password</h2>
            <TextField
                sx={{ mr: 1 }}
                label={'Password'}
                placeholder={'Password'}
                style={{marginBottom:'20px'}}
                error={Boolean(error)}
                helperText={error}
                // onChange={e=>{setDomainUrl(e.target.value);setError('');}}
                onChange={e=>{setPassword(e.target.value); setError('');}}
                type="password"
                fullWidth
                variant="outlined"
                
              />
              <TextField
                sx={{ mr: 1 }}
                label={'Confirm Password'}
                placeholder={'Confirm Password'}
                style={{marginBottom:'20px'}}
                // onChange={e=>{setDomainUrl(e.target.value);setError('');}}
                error={Boolean(error2)}
                helperText={error2}
                onChange={e=>{setPasswordConfirm(e.target.value); setError2('');}}
                type="password"
                fullWidth
                variant="outlined"
                
              />
              <Button
                variant="contained"
                size="large"
                onClick={onSubmit2}
                startIcon={loading ? <CircularProgress size="1rem" /> : null}
                disabled={loading}
            >
                {'Update Password'}
            </Button>
            
            
        </React.Fragment>
    )
}
