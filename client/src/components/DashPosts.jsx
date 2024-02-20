import React, { useEffect, useState } from "react";
import Post from "./../../../api/models/post.model";
import { useSelector } from "react-redux";
import { Button, Modal, ModalBody, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [fetchedPosts, setFetchedPosts] = useState([]);
  const [ showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false)
  const [postIdToDelete, setPostIdToDelete] = useState('');

  useEffect(() => {
    const fetchposts = async (req, res, next) => {
      try {
        const res = await fetch(`/api/posts/getposts?${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setFetchedPosts(data.posts);
        }
        if(data.totalPost < 10){
          setShowMore(false)
        }
        console.log(data.totalPost)
      } catch (error) {
        console.log(error)
      }
    };
    if (currentUser.isAdmin) {
      fetchposts();
    }
  }, [currentUser._id]);

  const handleShowMore= async ()=>{
    const startIndex =  fetchedPosts.length
    try {
      const res = await fetch(`/api/posts/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
      const newData = await res.json();
      if(res.ok){
        setFetchedPosts((prev)=>[ ...prev, ...newData.posts ])
        if(newData.posts.length < 10){
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error)
    }

  }
  const handleDeletePost = async ()=>{
    setShowModal(false);
    try {
      const res = await fetch(`/api/posts/delete/${postIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setFetchedPosts((prev) => prev.filter((post) => post._id!== postIdToDelete));
        setPostIdToDelete('');
      }
    } catch (error) {
      console.log(error);
    }
  }
 
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && fetchedPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {fetchedPosts.map((post) => (
              <Table.Body className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-green-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className="font-medium text-gray-800 dark:text-white" to={`/post/${post.slug}`}>
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white" key={post._id}>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell><span onClick={()=>{
                    setShowModal(true)
                    setPostIdToDelete(post._id)
                  }} className="font-medium text-red-400 hover:underline cursor-pointer">Delete</span></Table.Cell>
                  <Table.Cell><Link className="text-teal-500  hover:underline" to={`/update-post/${post._id}`}><span>Edit</span></Link> </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {
            showMore && (
              <button onClick={handleShowMore} className="text-teal-500 w-full self-center text-sm py-7 ">Show More</button>
            )
          }
        </>
      ) : (
        <p>You have no posts yet!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this Post?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeletePost}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
