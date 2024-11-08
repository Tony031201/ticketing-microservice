import buildClient from "../api/build-client"

const LandingPage = ({currentUser})=>{
    console.log(currentUser)
    return <h1>Landing page</h1>
}

LandingPage.getInitialProps = async (context) =>{

    console.log('getInitialProps context:', context); // 打印 context

    const {data} = await buildClient(context).get('/api/user/currentuser')
    console.log('getInitialProps context data:', data);
    return data

}

export default LandingPage