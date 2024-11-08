import {useState} from 'react'
import Router from 'next/router'
import request_hook from '../../hooks/use-request'

export default async()=>{
    return (
        <form>
            <div className='form-group'>
                <label>Email address</label>
                <input className='form-control'/>
            </div>
            <div className='form-group'>
                <label>password</label>
                <input type='password' className='form-control'/>
            </div>
            <button>Sign in</button>
        </form>
    )
}