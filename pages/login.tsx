import { useAuth } from '@/app/auth';
import RootLayout from '@/app/layout';
import { ReactElement } from 'react';

export default function LoginPage() {
  // const { login } = useAuth();

  // const handleLogin = () => {
  //   // Implement your login logic here (e.g., validate credentials)
  //   // Once the user is authenticated, call login with the user's ID
  //   // login('user123'); // Replace 'user123' with the actual user ID
  // };

  return (
    <div>
      <h1 className="bg-blue-500">Login</h1>
      {/* <button onClick={handleLogin}>Log In</button> */}
    </div>
  );
}
