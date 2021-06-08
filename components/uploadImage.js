import {useState} from 'react';
import { API_URL } from '@/config/index';
import styles from '@/styles/Form.module.css'
export default function UploadImage({newsId , imageUpload}) {
    
    const [image , setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("files" , image);
        formData.append("ref" , "sports");
        formData.append("refId" , newsId);
        formData.append("field" , "image")
         
        const res = await fetch(`${API_URL}/upload` , {
            method: 'POST',
            body: formData
        })
        if(res.ok) {
            imageUpload();
        }
    }
    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    }
    return (
        <div className={styles.form}>
            <h4>Upload Sports News Image</h4>
            <form onSubmit={handleSubmit}>
                <div className={styles.file}>
                    <input type='file' onChange={handleFileChange} />
                </div>
                <input type="submit" value="upload" className="btn" />
            </form>
        </div>
    );
}