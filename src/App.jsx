import { Routes,Route } from 'react-router-dom'
import Homepage from './Pages/Homepage'
import Home from './Pages/Home'
import Events from './Pages/Events'
import SignUp from './Pages/SignUp'
import Login from './Pages/Login'
// import BillingPage from './Pages/BillingPage'
import NotFound from './Pages/NotFound'
import Event from './Pages/Event'
import Payment2 from './Pages/Payment2'
import CreateEvent from './Pages/CreateEvent'
import BillingPage2 from './Pages/BillingPage2'
import About from './Pages/About'

function App() {
  return (
    <div className='w-full min-h-screen'>
      <Routes>
        <Route path = '/' element = {<Homepage/>}>
          <Route index element = {<Home/>}/>
          <Route path = '/Events' element = {<Events/>}/>
          <Route path = '/Signup' element = {<SignUp/>}/>
          <Route path = '/Login' element = {<Login/>}/>
          <Route path = '/CreateEvent' element = {<CreateEvent/>}/>
          <Route path = '/Billing/:id' element = {<BillingPage2/>}/>
          <Route path = '/Event/:id' element = {<Event/>}/>
          <Route path = '/About' element = {<About/>}/>
          <Route path = '/Payment/:id' element = {<Payment2/>}/>
          <Route path = '*' element = {<NotFound/>}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App;
