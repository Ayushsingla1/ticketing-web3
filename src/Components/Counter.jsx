import plus from '../assets/plus.png'
import minus from '../assets/minus.png'


const Counter = ({tickets, setTickets}) => {

    const decreaseCount = () => {
        if(tickets > 1){
            setTickets((prev) => {
                const updatedTickets = prev - 1;
                localStorage.setItem('tickets', updatedTickets); 
                return updatedTickets;
            });
        }
    }

    const increaseCount = () => {
        if(tickets < 6){
            setTickets((prev) => {
                const updatedTickets = prev + 1;
                localStorage.setItem('tickets', updatedTickets); 
                return updatedTickets;
            });
        }
    }


    return ( <div className='flex justify-between items-center rounded-lg gap-x-2 bg-white p-1'>
        <div className='bg-black p-1 rounded-lg' onClick={decreaseCount}><img src={minus} alt='-'/></div>
        <div className='text-[22px] text-black'>tickets: {tickets}</div>
        <div className='bg-black p-1 rounded-lg' onClick={increaseCount}><img src={plus} alt='+'/></div>
    </div> );
}
 
export default Counter;