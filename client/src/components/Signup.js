import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
import {useFormik} from "formik"
import { Form } from "semantic-ui-react";
import * as yup from "yup"

function SignUp({updateUser}) {
    const history = useHistory()

    const formSchema = yup.object().shape ({
        username: yup.string().required("Please enter a user name"),
        password: yup.string().required("Please enter a password")
    })

    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch('/signup', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values, null, 2),
            })
            .then(res => {
                if(res.ok) {
                    res.json().then(user => {
                        updateUser(user)
                        history.push('/')
                    })
                } else {
                    res.json().then(console.log)
                }
            })
        }
        
    })

    return (
        <>
        <h2 style={{color:'white'}}> {formik.errors.name} </h2>
        <h2> Please Sign up! </h2>
        <Form onSubmit={formik.handleSubmit}>
            <label>
                Username
                </label>
            <input type = 'text' name = 'username' value={formik.values.username} onChange={formik.handleChange} />
             <label>
                Password
                </label>
                <input type = 'password' name = 'password' value = {formik.values.password} onChange={formik.handleChange} />
    <input type='submit' value = 'Sign Up' />
    </Form>
    <button onClick={() => { history.push('./') }}>Have an account, login!</button>
    </>
    )
}
export default SignUp