import Head from 'next/head';
import { useEffect, useState } from 'react';
import UserPostsCard from '../components/UserPostsCard';
export default function Home() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

    fetchData();
  }, []);

  // Fetch and set user posts when a user is selected
  useEffect(() => {
    async function fetchUserPosts(userId) {
      try {
        const response = await fetch(`/api/user/${userId}/posts`);
        const data = await response.json();
        setUserPosts(data);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    }

    if (selectedUser) {
      fetchUserPosts(selectedUser.id);
    } else {
      setUserPosts([]); // Clear posts when no user is selected
    }
  }, [selectedUser]);

  // Handle user card click
  function handleUserCardClick(user) {
    setSelectedUser(user);
  }

  return (
    <div>
      <Head>
        <title>Awesome Users</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto max-w-5xl my-20">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {users.map((user) => (
            <li
              key={user.id}
              className={`shadow-md rounded overflow-hidden bg-white ${
                selectedUser && selectedUser.id === user.id ? 'bg-blue-100' : ''
              }`}
              onClick={() => handleUserCardClick(user)}
            >
              <div className="p-5 flex flex-col space-y-2">
                <p className="text-lg font-medium">{user.username}</p>
                <p className="text-gray-600">{user.email}</p>
                {user.name && <p className="text-gray-600">Name: {user.name}</p>}
                {user.image && <img src={user.image} alt={user.username} className="w-full rounded" />}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selectedUser && (
        <div className="container mx-auto max-w-5xl my-5">
          <h2 className="text-xl font-medium mb-2">Posts by {selectedUser.username}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userPosts.map((post) => (
              <UserPostsCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
