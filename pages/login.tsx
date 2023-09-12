import { useAuth } from '@/utils/useAuth';
import { useState } from 'react';
import { useRouter } from 'next/router';
import apiService from '@/utils/api.service';
import { User } from '@/types/model.type';
import { AxiosError } from 'axios';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  // Step 1: Add a useState hook to manage the input value
  const [username, setUsername] = useState('');

  // Step 2: Update the input field with an onChange handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior

    const name = username.trim();

    if (!name) return alert('Please enter your name');

    try {
      const { data } = await apiService.post<User>('/v1/auth/login', { name });
      // Update the login function to accept the full user data
      login({ _id: data._id, name: data.name });
      router.push('/'); // Redirect to the dashboard
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log({
          code: error.code,
          message: error.message,
          status: error.response?.status,
          error: error.response?.data,
        });

        if (error.response?.data) return alert(error.response.data.message);

        return alert('Authentication failed');
      }

      console.log(error);
      alert('Unknown error');
    }
  };

  return (
    <div className="mt-16">
      <h1 className="text-xl lg:text-3xl text-left lg:text-center mb-1 lg:mb-6">Enter your name</h1>
      <form onSubmit={handleLogin}>
        <input
          className="px-4 py-2 lg:px-6 lg:py-3 lg:text-xl outline-none text-gray-800 rounded-l-lg lg:rounded-l-xl"
          type="text"
          placeholder="John Doe"
          value={username} // Bind the input value to 'username'
          onChange={handleInputChange} // Handle input changes
        />

        <button
          type="submit"
          className="px-4 py-2 lg:px-6 lg:py-3 lg:text-xl bg-teal-500 font-medium rounded-r-lg lg:rounded-r-xl mt-2"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
