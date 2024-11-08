import axios from "axios";

const buildClient = context=>{
    if (typeof window === 'undefined'){
        // we are on the server 
        // requests should be made to http://ingress-nginx.ingress-nginx....
        console.log('Running on the server');
        const { req } = context;

        if (!req) {
            console.log('Server-side req: None');
        } else {
            console.log('Server-side req: Yes', req.headers);
        }
        

        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers,
            withCredentials: true
        })
    }else{
        // we are on the broswer
        // request can be made with a base url  of ''
        console.log('Running on the client');

        console.log('context:',context)
        return axios.create({
            baseURL: '/',
            withCredentials: true
        })
    }
}

export default buildClient