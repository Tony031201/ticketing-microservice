import {useState} from 'react'
import Router from 'next/router'
import request_hook from '../../hooks/use-request'

export default ()=>{
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const {doRequest,errors} = request_hook({
        url:'/api/user/signup',
        method:'post',
        body:{
            email,password
        },
        onSuccess:()=>Router.push('/')
    })

    const onSubmit = async(event) =>{
        event.preventDefault()

        const data = await doRequest()
        console.log('data from hook:',data)

    }

    return (
    <form onSubmit={onSubmit}>
        <h1>Sign Up</h1>
        <div className='form-group'>
            <label >Gmail</label>
            <input className='form-control' value={email} onChange={(e)=>setEmail(e.target.value)}/>
        </div>
        <div className='form-group'>
            <label>Password</label>
            <input className='form-control' type='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
        </div>
        {errors}
        <button className='btn btn-primary'>Sign Up</button>
    </form>
    )
}