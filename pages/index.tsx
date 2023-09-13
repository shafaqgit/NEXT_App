import Head from 'next/head';
import { useEffect, useState } from 'react';
import UserPostsCard from '../components/UserPostsCard';

interface User {
  id: number;
  username: string;
  email: string;
  name?: string;
  image?: string;
}

interface HomeProps {
  initialUsers?: User[]; 
}

export default function Home({ initialUsers = [] }: HomeProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]); 
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/api/users');
        const data = await response.json();
        // if (!response.ok) {
        //   throw new Error('Network response was not ok');
        // }
        setUsers(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        // setError('Error fetching users: ' + error.message); 
        console.error('Error fetching users:', error);
      }
    }
    if (initialUsers.length === 0) {
      fetchData();
    }
  }, [initialUsers]);

  useEffect(() => {
    async function fetchUserPosts(userId: number) {
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
      setUserPosts([]);
    }
  }, [selectedUser]);

  function handleUserCardClick(user: User) {
    setSelectedUser(user);
  }

  return (
    <div>
      <Head>
        <title>User's Thread</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto max-w-5xl my-20">
        {loading && <p>Loading users...</p>}
        {error && <p>{error}</p>}
        {users && users.length > 0 && (
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
        )}
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