import { useAuth } from '@/utils/auth';
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

  const handleLogin = async () => {
    try {
      const { data } = await apiService.post<User>('/v1/auth/login', { name: username });
      login(data._id);
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
    <div>
      <h1 className="text-3xl text-center mb-8">Enter you name</h1>
      <input
        className="px-4 py-2 outline-none text-gray-800 rounded-l-lg"
        type="text"
        placeholder="Your username"
        value={username} // Bind the input value to 'username'
        onChange={handleInputChange} // Handle input changes
      />

      <button onClick={handleLogin} className="px-4 py-2 bg-teal-500 font-medium rounded-r-lg mt-2">
        Submit
      </button>
    </div>
  );
}
