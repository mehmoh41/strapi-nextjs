import Layout from '@/components/Layout';
import Image from 'next/image'
import Link from 'next/link';
import {API_URL} from '@/config/index'
import {useState} from 'react'
import {useRouter} from 'next/router'
import styles from '@/styles/Form.module.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '@/components/Modal';
import UploadImage from '@/components/uploadImage';
export default function EditNews({sport}) {
    const [values, setValues] = useState({
        name: sport.name,
        detail : sport.detail,
        date: sport.date,
        time: sport.time,
    })

const [imagePreview , setImagePreview] = useState(
    sport.image ? sport.image.formats.thumbnail.url : null
);
const [showModal , setShowModal] = useState(false);


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
    const response =  await fetch(`${API_URL}/sports/${sport.id}` , {
        method: 'PUT',
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
const imageUpload = async (e) => {
    const res = await fetch(`${API_URL}/sports/${sport.id}`)
    const data = await res.json();
    setImagePreview(data.image.formats.thumbnail.url);
    setShowModal(false); 
}
const handleInputChange = (e) => {
    const {name , value} = e.target;
    setValues({...values , [name] : value})
}

    return (
            <Layout title="Update Sport Post">
                <Link href="/">Go Back</Link>
                <h2>Update Sport Post</h2>
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
                    <input className="btn" type="submit" value="Update Post"/>
                    </div>
                </form>
                {
                    imagePreview ? (
                        <Image src={imagePreview} height={100} width={180}/>
                    ): (
                        <div>
                            <p>No Image availabe</p>
                        </div>
                    )
                }
                <div>
                <button onClick={() => setShowModal(true)} className="btn-edit">
                    Upload Image
                </button>
                </div>
                <Modal show={showModal} onClose={() => setShowModal(false)}>
                    <UploadImage newsId={sport.id} imageUpload={imageUpload}/>
                </Modal>
            </Layout>
    );
}

export async function getServerSideProps({params: {id}}) {
    const res = await fetch(`${API_URL}/sports/${id}`);
    const sport = await res.json();

    return {
        props: {sport}
    }
}