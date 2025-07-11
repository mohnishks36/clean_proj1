import React from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [state, setState] = React.useState("login"); // or 'register'
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { setShowUserLogin, axios, navigate, setUser } = useAppContext();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    console.log("Login form submitted");

    try {
      const { data } = await axios.post(`/api/user/${state}`, {
        name,
        email,
        password,
      });

      console.log("Response from server:", data);

      if (data.success) {
        setUser(data.user);
        setShowUserLogin(false);
        navigate('/');
        toast.success(`Welcome ${data.user.name || 'back'}!`);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Login failed:", err);
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed inset-0 z-30 flex items-center justify-center text-sm text-gray-600 bg-black/50"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 items-start p-8 py-12 w-80 sm:w-[352px] bg-white rounded-lg shadow-xl border border-gray-200"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
        </p>

        {state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input
              type="text"
              placeholder="Type your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              required
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            type="email"
            placeholder="Type your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            type="password"
            placeholder="Type your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            required
          />
        </div>

        {state === "register" ? (
          <p>
            Already have an account?{" "}
            <span onClick={() => setState("login")} className="text-primary cursor-pointer">
              Login here
            </span>
          </p>
        ) : (
          <p>
            Don’t have an account?{" "}
            <span onClick={() => setState("register")} className="text-primary cursor-pointer">
              Register here
            </span>
          </p>
        )}

        <button
          type="submit"
          onClick={onSubmitHandler}
          className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer"
        >
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
