import Layout from '@/components/Layout';
import Link from 'next/link';
import {API_URL} from '@/config/index'
import {useState} from 'react'
import {useRouter} from 'next/router'
import styles from '@/styles/Form.module.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function AddNews() {
    const [values, setValues] = useState({
        name: '',
        detail : '',
        date: '',
        time: '',
    })

const {name , detail , date , time} = values;
const router = useRouter();
const handleSubmit = async (e) => {
    e.preventDefault();
    const emptyFieldCheck = Object.values(values).some(
        (element) => element === ""
    );
    if(emptyFieldCheck) {
        toast.error('please fill all input fields');
    }
    const response =  await fetch(`${API_URL}/sports` , {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(values)
    });
    if(!response.ok) {
        toast.error("something went wrong");
    }else {
        const sport =  await response.json();
        router.push(`/news/${sport.slug}`);
        
    }
}
const handleInputChange = (e) => {
    const {name , value} = e.target;
    setValues({...values , [name] : value})
}
    return (
            <Layout title="Add New Sports Post">
                <Link href="/">Go Back</Link>
                <h2>Add Sport Post</h2>
                <ToastContainer />
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.grid}>
                        <div>
                            <label htmlFor='name'>Name</label>
                            <input name="name" type="text" value={name} id="name" onChange={handleInputChange}/>
                        </div>
                        <div>
                            <label htmlFor='date'>Date</label>
                            <input name="date" type="date" value={date} id="date" onChange={handleInputChange}/>
                        </div>
                        <div>
                            <label htmlFor='time'>Time</label>
                            <input name="time" type="text" value={time} id="time" onChange={handleInputChange}/>
                        </div>

                        <div>
                            <label htmlFor='detail'>Detail</label>
                            <textarea name="detail" type="text" value={detail} id="detail" onChange={handleInputChange}></textarea>
                        </div>
                    <input className="btn" type="submit" value="Add Post"/>
                    </div>
                </form>
            </Layout>
    );
}