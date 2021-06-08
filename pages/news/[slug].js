import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import Link from "next/link";
import Image from "next/image";
import { API_URL } from "@/config/index";
import styles from "@/styles/News.module.css";
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SingleNews({ news }) {
  const router = useRouter();
  console.log("router===>", router);
  const deleteNews = async (e) => {
    e.preventDefault();
    if(window.confirm('Are you to delete the post?')) {
      const res = await fetch(`${API_URL}/sports/${news.id}`,{
        method: 'DELETE'
      });
      const data = res.json();
      if(!res.ok) {
        toast.error(data.message);
    }else {
        
        router.push(`/news`);
        
    }

    }
  }
  return (
    <Layout>
      <div className={styles.news}>
        <div className={styles.controls}>
          <Link href={`/news/edit/${news.id}`}>
            <button className="btn-edit">Edit</button>
          </Link>
          <button className="btn-delete" onClick={deleteNews}>Delete</button>
        </div>
        <span>
        {moment(news.date).format('DD-MM-YYYY')} {news.time}
        </span>

        <h1>{news.name}</h1>
        <ToastContainer />
        {news.image && (
          <div className={styles.image}>
            <Image src={news.image ? news.image.formats.medium.url : "/images/hero.jpg"} width={900} height={600} />
          </div>
        )}
        <p>{news.detail}</p>
        <Link href="/news">
          <a className={styles.back}>Go Back</a>
        </Link>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const res = await fetch(`${API_URL}/sports`);
  const news = await res.json();
  const paths = news.map((item) => ({
    params: { slug: item.slug },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params: { slug } }) {
  const res = await fetch(`${API_URL}/sports?slug=${slug}`);
  const singleNews = await res.json();
  return {
    props: {
      news: singleNews[0],
    },
    revalidate: 1,
  };
}

// export async function getServerSideProps({ query: { slug } }) {
//   const res = await fetch(`${API_URL}/api/news/${slug}`);
//   const singleNews = await res.json();
//   return {
//     props: {
//       news: singleNews[0],
//     },
//   };
// }
